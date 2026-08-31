import { Controller } from "../types/handlers";
import * as addressService from "../services/address.service";
import { CreateAddressBody, UpdateAddressBody } from "../schemas/addresses";

export const getUserAddresses: Controller = async (req, res, next) => {
  try {
    const addresses = await addressService.getUserAddresses(req.user!.id);

    res.status(200).json({ success: true, data: { addresses } });
  } catch (error) {
    next(error);
  }
};

export const createAddress: Controller = async (req, res, next) => {
  try {
    const address = await addressService.createAddress(
      req.user!.id,
      req.body as CreateAddressBody,
    );

    res
      .status(201)
      .json({ success: true, message: "Address created", data: { address } });
  } catch (error) {
    next(error);
  }
};

export const getAddressById: Controller = async (req, res, next) => {
  try {
    const address = await addressService.getAddressById(
      req.user!.id,
      req.params.addressId as string,
    );

    res.status(200).json({ success: true, data: { address } });
  } catch (error) {
    next(error);
  }
};

export const updateAddress: Controller = async (req, res, next) => {
  try {
    const address = await addressService.updateAddress(
      req.user!.id,
      req.params.addressId as string,
      req.body as UpdateAddressBody,
    );

    res
      .status(200)
      .json({ success: true, message: "Address updated", data: { address } });
  } catch (error) {
    next(error);
  }
};

export const deleteAddress: Controller = async (req, res, next) => {
  try {
    const address = await addressService.deleteAddress(
      req.user!.id,
      req.params.addressId as string,
    );

    res
      .status(200)
      .json({ success: true, message: "Address deleted", data: { address } });
  } catch (error) {
    next(error);
  }
};

export const setToDefault: Controller = async (req, res, next) => {
  try {
    const address = await addressService.setToDefault(
      req.user!.id,
      req.params.addressId as string,
    );

    res.status(200).json({
      success: true,
      message: "Address set to default",
      data: { address },
    });
  } catch (error) {
    next(error);
  }
};
