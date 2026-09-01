import AppError from "../utils/AppError";
import pool from "../database/db";
import { OrderItem } from "../schemas/order_items";
import { OrderWithItems } from "../schemas/orders";
import { calculateDistanceMeters } from "../utils/calculateDistanceMeters";
import {
  CancelOrderParams,
  CheckoutParams,
  GetUserOrderParams,
  GetUserOrdersParams,
} from "../types/entities/order.types";

import * as orderItemService from "../services/order_item.service";

import * as orderRepository from "../repositories/order.repository";
import * as cartRepository from "../repositories/cart.repository";
import * as cartItemRepository from "../repositories/cart_item.repository";
import * as inventoryRepository from "../repositories/inventory.repository";
import * as addressRepository from "../repositories/address.repository";
import * as storeRepository from "../repositories/store.repository";
import * as shippingRepository from "../repositories/shipping.repository";
import * as orderItemRepository from "../repositories/order_item.repository";

export const getUserOrders = async (
  params: GetUserOrdersParams,
): Promise<OrderWithItems[]> => {
  const { userId, filters } = params;

  const orders = await orderRepository.find(userId, filters);

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
  params: GetUserOrderParams,
): Promise<OrderWithItems> => {
  const { userId, orderId } = params;

  const order = await orderRepository.findById(userId, orderId);

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
  params: CheckoutParams,
): Promise<OrderWithItems> => {
  const { userId, addressId } = params;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // =======================================
    // GET USER CART
    // =======================================

    const cart = await cartRepository.findById(userId, client);

    if (!cart) {
      throw new AppError(404, "Cart not found");
    }

    // =======================================
    // GET CURRENT CART ITEMS
    // =======================================

    const cartItems = await cartItemRepository.findByCartId(cart.id, client);

    if (cartItems.length === 0) {
      throw new AppError(400, "Cannot checkout with an empty cart");
    }

    // =======================================
    // DECREMENT STOCK & ACCUMULATE SUBTOTAL
    // =======================================

    let subtotalCents = 0;

    for (const ci of cartItems) {
      const { product, quantity } = ci;

      const inventory = await inventoryRepository.decrement(
        client,
        product.id,
        quantity,
      );

      if (!inventory) {
        throw new AppError(409, `Insufficient stock for ${product.name}`);
      }

      subtotalCents += product.price_cents * quantity;
    }

    // =======================================
    // GET USER PROVIDED ADDRESS
    // =======================================

    const address = await addressRepository.findById(userId, addressId);

    if (!address) {
      throw new AppError(404, "Shipping address not found");
    }

    const { latitude: userAddLat, longitude: userAddLon } = address;

    // =======================================
    // GET STORE ADDRESS
    // =======================================

    const storeAddress = await storeRepository.find(client);

    if (!storeAddress) {
      throw new AppError(400, "No store is currently registered");
    }

    const { latitude: storeLat, longitude: storeLon } = storeAddress;

    // =======================================
    // CALCULATE STRAIGHT-LINE DISTANCE
    // BETWEEN ADDRESSES
    // =======================================

    const shippingDistanceMeters = Math.round(
      calculateDistanceMeters(
        { lat: userAddLat, lon: userAddLon },
        { lat: storeLat, lon: storeLon },
      ),
    );

    // =======================================
    // GET SHIPPING METHOD
    // =======================================

    const shippingMethod = await shippingRepository.find(client);

    if (!shippingMethod) {
      throw new AppError(400, "No shipping method is registered currently");
    }

    const { base_fee_cents, fee_per_km_cents } = shippingMethod;

    // =======================================
    // CALCULATE TAX, SHIPPING FEE, TOTAL
    // =======================================

    const taxCents = Math.round(subtotalCents * 0.12);
    const shippingFeeCents =
      base_fee_cents +
      Math.ceil(shippingDistanceMeters / 1000) * fee_per_km_cents;

    const totalCents = subtotalCents + taxCents + shippingFeeCents;

    // =======================================
    // CREATE / INSERT ORDER
    // =======================================

    const order = await orderRepository.create(client, {
      user_id: userId,
      subtotal_cents: subtotalCents,
      tax_cents: taxCents,
      shipping_fee_cents: shippingFeeCents,
      shipping_distance_meters: shippingDistanceMeters,
      total_cents: totalCents,
    });

    // =======================================
    // CREATE / INSERT ORDER ITEMS
    // =======================================

    const items: OrderItem[] = [];

    for (const ci of cartItems) {
      const { product, quantity } = ci;

      const item = await orderItemRepository.add(client, {
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

    // =======================================
    // CLEAR USER CART
    // =======================================

    await cartItemRepository.removeAllByCartId(client, cart.id);

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

export const cancelOrder = async (
  params: CancelOrderParams,
): Promise<OrderWithItems> => {
  const { userId, orderId } = params;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const order = await orderRepository.findById(userId, orderId, client);

    if (!order) {
      throw new AppError(404, "Order not found");
    }

    if (order.status !== "pending") {
      throw new AppError(400, "Only pending orders can be cancelled");
    }

    // =======================================
    // INCREMENT BACK TO INVENTORY
    // =======================================

    const items = await orderItemRepository.findByOrderId(orderId, client);

    for (const item of items) {
      if (item.product_id === null) continue;

      await inventoryRepository.increment(
        client,
        item.product_id,
        item.quantity,
      );
    }

    // =======================================
    // TAG ORDER AS CANCELLED
    // =======================================

    const cancelledOrder = await orderRepository.cancel(orderId, client);

    await client.query("COMMIT");

    return {
      ...cancelledOrder,
      items,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
