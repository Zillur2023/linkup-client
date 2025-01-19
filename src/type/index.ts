export interface IInput {
    variant?: "flat" | "bordered" | "faded" | "underlined";
    size?: "sm" | "md" | "lg";
    required?: boolean;
    type?: string ;
    label: string;
    name: string ;
    disabled?: boolean;
  }