export type UpdateResult<K extends string, T> = {
  [P in K]: T;
} & {
  old_values: Partial<T>;
  new_values: Partial<T>;
};

export type GetResult<K extends string, T> = {
  [P in K]: T[];
} & {
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
};
