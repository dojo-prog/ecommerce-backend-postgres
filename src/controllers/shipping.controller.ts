import { Controller } from "../types/handlers";
import * as shippingService from "../services/shipping.service";
import { CreateShippingBody, UpdateShippingBody } from "../schemas/shippings";

export const getShippingDetails: Controller = async (req, res, next) => {
  try {
    const shipping = await shippingService.getShippingDetails();

    res.status(200).json({ success: true, data: { shipping } });
  } catch (error) {
    next(error);
  }
};

export const createShipping: Controller = async (req, res, next) => {
  try {
    const shipping = await shippingService.createShipping({
      payload: req.body as CreateShippingBody,
    });

    res.status(201).json({
      success: true,
      message: "Created shipping policy/rate",
      data: { shipping },
    });
  } catch (error) {
    next(error);
  }
};

export const updateShipping: Controller = async (req, res, next) => {
  try {
    const data = await shippingService.updateShipping({
      payload: req.body as UpdateShippingBody,
    });

    res
      .status(200)
      .json({ success: true, message: "Updated shipping policy/rate", data });
  } catch (error) {
    next(error);
  }
};

export const deleteShipping: Controller = async (req, res, next) => {
  try {
    const shipping = await shippingService.deleteShipping();

    res.status(200).json({
      success: true,
      message: "Shipping policy/rate has been deleted",
      data: { shipping },
    });
  } catch (error) {
    next(error);
  }
};
