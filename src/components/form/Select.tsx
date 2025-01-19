import { IInput } from "@/type";
import { Select as NextUiSelect, SelectItem } from "@heroui/react";
import { useFormContext } from "react-hook-form";

interface IProps extends IInput {
  // options: {
  //   uid: string;
  //   name: string;
  // }[];
  options: string[]
  value?: string
}

export default function Select({
  options,
  name,
  label,
  variant = "bordered",
  disabled,
  value,
}: IProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <NextUiSelect
      {...register(name)}
      className="min-w-full sm:min-w-[225px]"
      isDisabled={disabled}
      label={label}
      variant={variant}
      value={value}
    >
      {options.map((option) => (
        <SelectItem key={option}>{option}</SelectItem>
      ))}
    </NextUiSelect>
  );
}
