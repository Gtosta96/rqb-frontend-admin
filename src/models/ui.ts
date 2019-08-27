export type ISnackbarVariants = "success" | "warning" | "error" | "info";

export type ISnackbarIcons = { [v in ISnackbarVariants]: any };

export interface ISnackbarPayload {
  variant: ISnackbarVariants;
  message: string;
}
