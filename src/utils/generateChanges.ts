import AppError from "./AppError";

interface GenerateChangesResult {
  old_values: Record<string, unknown>;
  new_values: Record<string, unknown>;
}

const generateChanges = (
  original: Record<string, unknown>,
  modified: Record<string, unknown>,
): GenerateChangesResult => {
  const old_values: Record<string, unknown> = {};
  const new_values: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(modified)) {
    if (value === undefined) continue;

    if (original[key] !== value) {
      new_values[key] = value;
      old_values[key] = original[key];
    }
  }

  if (Object.keys(new_values).length === 0) {
    throw new AppError(400, "No changes has been made");
  }

  return {
    old_values,
    new_values,
  };
};

export default generateChanges;
