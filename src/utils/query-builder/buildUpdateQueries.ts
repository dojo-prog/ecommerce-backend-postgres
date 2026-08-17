interface BuildUpdateQueriesResult {
  setClause: string;
  values: unknown[];
}

const buildUpdateQueries = (
  changes: Record<string, unknown>,
): BuildUpdateQueriesResult => {
  const changesKeys = Object.keys(changes);

  const setFields = changesKeys.map((k, i) => `${k} = $${i + 1}`).join(", ");
  const values = changesKeys.map((k) => changes[k]);

  return {
    setClause: `SET ${setFields}`,
    values,
  };
};

export default buildUpdateQueries;
