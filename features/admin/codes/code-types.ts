export interface CodeFormValues {
  code: string;
  percent: string;
  maxUses: string;
  expires: string;
}

export interface CodeFormState {
  status: "idle" | "ok" | "error";
  message: string;
  errors: Partial<Record<keyof CodeFormValues, string>>;
  values: CodeFormValues;
}

export const EMPTY_CODE_VALUES: CodeFormValues = { code: "", percent: "", maxUses: "", expires: "" };

export const initialCodeState: CodeFormState = { status: "idle", message: "", errors: {}, values: EMPTY_CODE_VALUES };
