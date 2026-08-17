import { z } from "zod";
import {
  IsoDatetimeSchema,
  LatitudeSchema,
  LongitudeSchema,
  UpdateResultSchema,
  UUIDSchema,
} from "./common";

// =======================================
// REUSABLE FIELDS
// =======================================

export const RegionSchema = z
  .string()
  .trim()
  .min(1, { message: "Region is required" })
  .max(100, "Region cannot exceed 100 characters");

export const ProvinceSchema = z
  .string()
  .trim()
  .min(1, { message: "Province is required" })
  .max(100, "Province cannot exceed 100 characters");

export const CitySchema = z
  .string()
  .trim()
  .min(1, { message: "City is required" })
  .max(100, "City cannot exceed 100 characters");

export const BarangaySchema = z
  .string()
  .trim()
  .min(1, { message: "Barangay is required" })
  .max(100, "Barangay cannot exceed 100 characters");

export const AddressLineSchema = z
  .string()
  .min(1, { message: "Address line / street address is required" })
  .max(240, "Address line cannot exceed 240 characters");

// =======================================
// DATABASE ENTITY SCHEMA
// =======================================

export const AddressEntitySchema = z.object({
  id: UUIDSchema,
  user_id: UUIDSchema,
  region: RegionSchema,
  province: ProvinceSchema,
  city: CitySchema,
  barangay: BarangaySchema,
  address_line: AddressLineSchema,
  latitude: LatitudeSchema,
  longitude: LongitudeSchema,
  created_at: IsoDatetimeSchema,
  updated_at: IsoDatetimeSchema,
});

// =======================================
// REQ PARAMS SCHEMA
// =======================================

export const AddressParamsSchema = z.object({
  addressId: UUIDSchema,
});

// =======================================
// REQ BODY SCHEMA
// =======================================

export const AddressBaseInputSchema = z.object({
  region: RegionSchema,
  province: ProvinceSchema,
  city: CitySchema,
  barangay: BarangaySchema,
  address_line: AddressLineSchema,
});

export const CreateAddressInputSchema = AddressBaseInputSchema;
export const UpdateAddressInputSchema = AddressBaseInputSchema;

// =======================================
// RESULTS SCHEMA
// =======================================

export const UpdateAddressResultSchema = z.object({
  address: AddressEntitySchema,
  ...UpdateResultSchema.shape,
});

// =======================================
// TYPES
// =======================================

export type UserAddress = z.infer<typeof AddressEntitySchema>;

export type CreateAddressPayload = z.infer<typeof CreateAddressInputSchema>;
export type UpdateAddressPayload = z.infer<typeof UpdateAddressInputSchema>;

export type UpdateAddressResult = z.infer<typeof UpdateAddressResultSchema>;
