import type { CategoryFormData } from "../../model";

export type CategoryFormProps = {
  defaultValues?: CategoryFormData;
  isLoading?: boolean;
  submitText: string;
  onSubmit: (data: CategoryFormData) => Promise<void>;
};
