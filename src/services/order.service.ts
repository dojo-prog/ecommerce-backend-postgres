import AppError from "../utils/AppError";
import pool from "../database/db";
import { OrderItem } from "../schemas/order_items";
import { OrderQueryPayload, OrderWithItems } from "../schemas/orders";
import { calculateDistanceMeters } from "../utils/calculateDistanceMeters";

import * as orderModel from "../models/order.model";
import * as orderItemService from "../services/order_item.service";
import * as cartModel from "../models/cart.model";
import * as cartItemModel from "../models/cart_item.model";
import * as inventoryModel from "../models/inventory.model";
import * as addressModel from "../models/address.model";
import * as storeModel from "../models/store.model";
import * as shippingModel from "../models/shipping.model";
import * as orderItemModel from "../models/order_item.model";

export const getUserOrders = async (
  userId: string,
  filters: OrderQueryPayload,
): Promise<OrderWithItems[]> => {
  const orders = await orderModel.find(userId, filters);

  if (orders.length === 0) {
    return [];
  }

  const orderIds = orders.map((o) => o.id);

  const allOrdersItems =
    await orderItemService.getOrderItemsByOrderIds(orderIds);

  const itemsByOrderId = new Map<string, OrderItem[]>();

  for (const item of allOrdersItems) {
    const orderItems = itemsByOrderId.get(item.order_id) ?? [];

    orderItems.push(item);

    itemsByOrderId.set(item.order_id, orderItems);
  }

  const ordersWithItems = orders.map(({ user_id, ...o }) => ({
    ...o,
    items: itemsByOrderId.get(o.id) ?? [],
  }));

  return ordersWithItems;
};

export const getUserOrderById = async (
  userId: string,
  orderId: string,
): Promise<OrderWithItems> => {
  const order = await orderModel.findById(userId, orderId);

  if (!order) {
    throw new AppError(404, "Order not found");
  }

  const items = await orderItemService.getOrderItemsByOrderId(orderId);

  const { user_id, ...rest } = order;

  return {
    ...rest,
    items,
  };
};

export const checkout = async (
  userId: string,
  addressId: string,
): Promise<OrderWithItems> => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Get Cart
    const cart = await cartModel.findById(userId, client);

    if (!cart) {
      throw new AppError(404, "Cart not found");
    }

    // Get Cart Items
    const cartItems = await cartItemModel.findByCartId(cart.id, client);

    if (cartItems.length === 0) {
      throw new AppError(400, "Cannot checout with an empty cart");
    }

    let subtotalCents = 0;

    // Decrement product stock & accumulate subtotal
    for (const ci of cartItems) {
      const { product, quantity } = ci;

      const inventory = await inventoryModel.decrement(
        client,
        product.id,
        quantity,
      );

      if (!inventory) {
        throw new AppError(409, `Insufficient stock for ${product.name}`);
      }

      subtotalCents += product.price_cents * quantity;
    }

    // Get user address coordinates
    const address = await addressModel.findById(userId, addressId);

    if (!address) {
      throw new AppError(404, "Shipping address not found");
    }

    const { latitude: userAddLat, longitude: userAddLon } = address;

    // Get store address
    const { latitude: storeLat, longitude: storeLon } = await storeModel.find();

    // Calculate straight-line geo distance
    const shippingDistanceMeters = Math.round(
      calculateDistanceMeters(
        { lat: userAddLat, lon: userAddLon },
        { lat: storeLat, lon: storeLon },
      ),
    );

    // Get shipping method
    const { base_fee_cents, fee_per_km_cents } = await shippingModel.find();

    // Calculate fees
    const taxCents = Math.round(subtotalCents * 0.12);
    const shippingFeeCents =
      base_fee_cents +
      Math.ceil(shippingDistanceMeters / 1000) * fee_per_km_cents;

    const totalCents = subtotalCents + taxCents + shippingFeeCents;

    // Create order
    const order = await orderModel.create(client, {
      user_id: userId,
      subtotal_cents: subtotalCents,
      tax_cents: taxCents,
      shipping_fee_cents: shippingFeeCents,
      shipping_distance_meters: shippingDistanceMeters,
      total_cents: totalCents,
    });

    // Create order items
    const items: OrderItem[] = [];

    for (const ci of cartItems) {
      const { product, quantity } = ci;

      const item = await orderItemModel.add(client, {
        order_id: order.id,
        product_id: product.id,
        product_name: product.name,
        product_thumbnail_url: product.thumbnail_url,
        quantity,
        unit_price_cents: product.price_cents,
        subtotal_cents: product.price_cents * quantity,
      });

      items.push(item);
    }

    // Clear cart
    await cartItemModel.removeAllByCartId(client, cart.id);

    await client.query("COMMIT");

    return {
      ...order,
      items,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
