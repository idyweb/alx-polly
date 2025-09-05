export type ClassInput =
  | string
  | number
  | boolean
  | null
  | undefined
  | Record<string, unknown>
  | ClassInput[];

function toArray(input: ClassInput): Array<string> {
  if (input == null || input === false) return [];
  if (typeof input === "string" || typeof input === "number") return [String(input)];
  if (Array.isArray(input)) return input.flatMap(toArray);
  if (typeof input === "object") {
    const classes: string[] = [];
    for (const key of Object.keys(input)) {
      const value = (input as Record<string, unknown>)[key];
      if (Boolean(value)) classes.push(key);
    }
    return classes;
  }
  return [];
}

export function cn(...inputs: Array<ClassInput>): string {
  return inputs.flatMap(toArray).join(" ");
}


