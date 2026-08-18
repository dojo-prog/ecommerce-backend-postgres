import { ProductSpecificQueryPayload } from "../../schemas/products";

interface BuildProductSpecificFiltersResult {
  conditions: string[];
  values: unknown[];
}

const buildProductSpecificFilters = (
  specificFilters: ProductSpecificQueryPayload,
): BuildProductSpecificFiltersResult => {
  const { category, minPrice, maxPrice, inStock } = specificFilters;

  const conditions: string[] = [];
  const values: unknown[] = [];

  if (category) {
    values.push(category);
    conditions.push(`c.slug = $${values.length}`);
  }

  if (!Number.isNaN(minPrice) && minPrice !== undefined) {
    values.push(minPrice * 100);
    conditions.push(`p.price_cents >= $${values.length}`);
  }

  if (!Number.isNaN(maxPrice) && maxPrice !== undefined) {
    values.push(maxPrice * 100);
    conditions.push(`p.price_cents <= $${values.length}`);
  }

  if (inStock) {
    conditions.push(`i.quantity > 0`);
  }

  return {
    conditions,
    values,
  };
};

export default buildProductSpecificFilters;
