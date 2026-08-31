import { z } from "zod";

export const UUIDSchema = z.string().uuid({ message: "Invalid UUID format" });

export const IsoDatetimeSchema = z.iso.datetime({
  message: "Invalid ISO datetime format",
});

export const IsoDateSchema = z.iso.date({ message: "Invalid ISO date format" });

export const SlugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug");

export const NonNegativeIntSchema = z.coerce
  .number()
  .int()
  .nonnegative({ message: "Amount cannot be less than 0" });

export const DecimalSchema = z
  .number()
  .nonnegative()
  .refine((value) => Number.isInteger(value * 100), {
    message: "Number cannot have more than 2 decimal places",
  });

export const UrlSchema = z.string().url({ message: "Invalid URL format" });

export const SortOrderSchema = z.enum(["desc", "asc"], {
  message: "Invalid sort order",
});

export const PaginationQuerySchema = z.object({
  page: NonNegativeIntSchema.optional().default(1),
  limit: NonNegativeIntSchema.optional().default(10),
});

export const SearchQuerySchema = z
  .string()
  .max(100, { message: "Search query cannot exceed 100 characters" })
  .optional();

export const PaginationResultSchema = PaginationQuerySchema.extend({
  total: NonNegativeIntSchema.default(0),
  total_pages: NonNegativeIntSchema.max(100, {
    message: "Limit cannot exceed 100",
  }).default(0),
});

export const UpdateResultSchema = z.object({
  old_values: z.record,
  new_values: z.record,
});

export const LatitudeSchema = z
  .number()
  .min(-90, { message: "Latitude must be at least -90" })
  .max(90, { message: "Latitude cannot exceed 90" });

export const LongitudeSchema = z
  .number()
  .min(-180, { message: "Longitude must be at least -180" })
  .max(180, { message: "Longitude cannot exceed 180" });

export const ImageUrlSchema = z.string().url({ message: "Invalid URL format" });

export const ImagePublicIdSchema = z.string().min(1);
