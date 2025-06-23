import { ValidatorFn } from "@angular/forms";
import { DynamicFieldType } from "./dynamic-field.type";

export interface DynamicField {
  name: string;
  label: string;
  type: DynamicFieldType;
  options?: { label: string; value: string }[];
  validators?: ValidatorFn[];
  required?: boolean;
  patternHint?: string;
  fileAccept?: string;
  autocomplete?: string;
  defaultValue: any;
}