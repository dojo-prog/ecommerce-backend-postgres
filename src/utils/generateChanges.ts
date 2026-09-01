import AppError from "./AppError";

interface GenerateChangesResult<T extends object> {
  old_values: Partial<T>;
  new_values: Partial<T>;
}

const generateChanges = <T extends object>(
  original: T,
  modified: Partial<T>,
  throwOnNoChanges = true,
): GenerateChangesResult<T> => {
  const old_values: Partial<T> = {};
  const new_values: Partial<T> = {};

  for (const key of Object.keys(modified) as Array<keyof T>) {
    const value = modified[key];

    if (value === undefined) continue;

    if (original[key] !== value) {
      old_values[key] = original[key];
      new_values[key] = value;
    }
  }

  if (throwOnNoChanges) {
    if (Object.keys(new_values).length === 0) {
      throw new AppError(400, "No changes have been made");
    }
  }

  return {
    old_values,
    new_values,
  };
};

export default generateChanges;
