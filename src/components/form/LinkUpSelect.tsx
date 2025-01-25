import { IInput } from "@/type";
import { Select, SelectItem } from "@heroui/react";
import { useFormContext } from "react-hook-form";

interface IProps extends IInput {
  // options: {
  //   uid: string;
  //   name: string;
  // }[];
  options: string[]
  value?: string
}

export default function LinkUpSelect({
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
  console.log("select value",value)

  return (
    <Select
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
    </Select>
  );
}
