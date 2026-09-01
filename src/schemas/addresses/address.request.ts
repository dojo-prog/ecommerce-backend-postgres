import { z } from "zod";
import { UUIDSchema } from "../common";
import {
  AddressLineSchema,
  BarangaySchema,
  CitySchema,
  ProvinceSchema,
  RegionSchema,
} from "./address.schema";

// =======================================
// REQ PARAMS SCHEMA
// =======================================

export const AddressParamsSchema = z.object({
  addressId: UUIDSchema,
});

// =======================================
// REQ BODY SCHEMA
// =======================================

export const AddressBaseBodySchema = z.object({
  region: RegionSchema,
  province: ProvinceSchema,
  city: CitySchema,
  barangay: BarangaySchema,
  addressLine: AddressLineSchema,
});

export const CreateAddressBodySchema = AddressBaseBodySchema;

export const UpdateAddressBodySchema = AddressBaseBodySchema;

// =======================================
// TYPES
// =======================================

export type CreateAddressBody = z.infer<typeof CreateAddressBodySchema>;

export type UpdateAddressBody = z.infer<typeof UpdateAddressBodySchema>;
