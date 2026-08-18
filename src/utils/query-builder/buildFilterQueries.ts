interface BuildFilterQueriesResult {
  whereClause: string;
  orderByClause: string;
  limitClause: string;
  offsetClause: string;

  values: unknown[];
}

interface GenericFilters {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  [key: string]: unknown;
}

const buildFilterQueries = (
  filters: GenericFilters,
  baseWhereConditions: string[] = [],
  baseValues: unknown[] = [],
  searchColumns: string[] = [],
  allowedSort: string[] = [],
): BuildFilterQueriesResult => {
  let whereClause = "";
  let orderByClause = "";
  let limitClause = "";
  let offsetClause = "";

  const whereConditions = [...baseWhereConditions];

  const values = [...baseValues];

  const { page, limit, sort, order, ...rest } = filters;

  // =======================================
  // WHERE CLAUSE CONSTRUCTION
  // =======================================

  for (const [key, value] of Object.entries(rest)) {
    if (value === undefined) continue;

    const placeholder = `$${values.length + 1}`;

    if (key === "search") {
      if (!searchColumns.length) continue;

      const searchCondition = searchColumns
        .map((sc) => `${sc} ILIKE ${placeholder}`)
        .join(" OR ");

      whereConditions.push(searchCondition);
      values.push(`%${value}%`);
    } else {
      whereConditions.push(`${key} = ${placeholder}`);
      values.push(value);
    }
  }

  if (whereConditions.length > 0) {
    whereClause = `WHERE ${whereConditions.join(" AND ")}`;
  }

  // =======================================
  // ORDER BY CLAUSE CONSTRUCTION
  // =======================================

  if (sort && allowedSort.includes(sort)) {
    const sortMap: Record<string, [string, "ASC" | "DESC"]> = {
      newest: ["created_at", "DESC"],
      oldest: ["created_at", "ASC"],
    };

    const [column, direction] =
      sortMap[sort] ?? (sort.split("_") as [string, "ASC" | "DESC"]);

    orderByClause = `ORDER BY ${column} IS NULL, ${column} ${direction}`;
  }

  // =======================================
  // LIMIT & OFFSET CLAUSE CONSTRUCTION
  // =======================================

  if (page && limit) {
    limitClause = `LIMIT ${limit}`;
    offsetClause = `OFFSET ${(page - 1) * limit}`;
  }

  return {
    whereClause,
    orderByClause,
    limitClause,
    offsetClause,
    values,
  };
};

export default buildFilterQueries;
