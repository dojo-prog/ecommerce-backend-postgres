import { Controller } from "../types/handlers";
import * as orderService from "../services/order.service";
import { OrderQuerySchema } from "../schemas/orders";

export const getUserOrders: Controller = async (req, res, next) => {
  try {
    const orders = await orderService.getUserOrders({
      userId: req.user!.id,
      filters: OrderQuerySchema.parse(req.query),
    });

    res.status(200).json({ success: true, data: { orders } });
  } catch (error) {
    next(error);
  }
};

export const getUserOrderById: Controller = async (req, res, next) => {
  try {
    const order = await orderService.getUserOrderById({
      userId: req.user!.id,
      orderId: req.params.orderId as string,
    });

    res.status(200).json({ success: true, data: { order } });
  } catch (error) {
    next(error);
  }
};

export const checkout: Controller = async (req, res, next) => {
  try {
    const order = await orderService.checkout({
      userId: req.user!.id,
      addressId: req.body.address_id,
    });

    res
      .status(200)
      .json({ success: true, message: "Order created", data: { order } });
  } catch (error) {
    next(error);
  }
};
