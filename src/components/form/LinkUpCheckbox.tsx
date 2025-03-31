import { Checkbox } from "@heroui/react";
import React from "react";
import { useFormContext } from "react-hook-form";

interface LinkUpCheckboxProps {
  name: string;
  label: string;
}

const LinkUpCheckbox: React.FC<LinkUpCheckboxProps> = ({ name, label }) => {
  const {
    register,
    // formState: { errors },
  } = useFormContext();

  return (
    <Checkbox
      {...register(name)}
      classNames={{
        label: "text-small",
      }}
    >
      {label}
    </Checkbox>
  );
};

export default LinkUpCheckbox;
