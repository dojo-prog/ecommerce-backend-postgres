interface BuildInsertQueriesResult {
  columnsStr: string;
  placeholdersStr: string;
  values: unknown[];
}

const buildInsertQueries = <T extends object>(
  payload: T,
): BuildInsertQueriesResult => {
  const columns: string[] = [];
  const placeholders: string[] = [];
  const values: unknown[] = [];

  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined) continue;

    const placeholder = `$${values.length + 1}`;

    columns.push(key);
    placeholders.push(placeholder);
    values.push(value);
  }

  return {
    columnsStr: columns.join(", "),
    placeholdersStr: placeholders.join(", "),
    values,
  };
};

export default buildInsertQueries;
