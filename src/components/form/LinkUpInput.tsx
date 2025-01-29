"use client";
import { ReactNode, useState } from "react";
import { useFormContext } from "react-hook-form";
import { EyeSlashFilledIcon } from "./EyeSlashFilledIcon";
import { EyeFilledIcon } from "./EyeFilledIcon";
import { Button, Input } from "@heroui/react";

interface InputProps {
  name: string;
  label: string;
  labelPlacement?: "outside" | "outside-left" | "inside" | undefined;
  placeholder?: string;
  required?: boolean;
  type?: "text" | "password";
  size?: "sm" | "md" | "lg";
  value?: string;
  isReadOnly?: boolean;
  // focusRef?: React.Ref<HTMLInputElement>; 
  focusRef?: (el: HTMLInputElement | null) => void;
  endContent?: ReactNode;
}

export default function LinkUpInput({
  name,
  label,
  labelPlacement,
  placeholder,
  required = false,
  type = "text",
  size = "md",
  value,
  isReadOnly=false,
  focusRef,
  endContent
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { register, watch, getValues, formState: { errors } } = useFormContext();

  console.log(!!watch(name))
  console.log({getValues})

  const inputType = type === "password" && isPasswordVisible ? "text" : type;
  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);
 

  return (
    <div>
      <Input
        {...register(name)}
        label={label}
        labelPlacement={labelPlacement}
        placeholder={placeholder}
        required={required}
        size={size}
        value={value}
        type={inputType}
        errorMessage={errors[name]?.message as string}
        isInvalid={Boolean(errors[name])}
        isReadOnly={isReadOnly}
        // ref={focusRef}
        ref={(e) => {
          register(name).ref(e); // Register ref for react-hook-form
          if (focusRef) focusRef(e); // Apply focusRef as well
        }}
        endContent={
         endContent ? <Button isDisabled={!watch(name)} type="submit" isIconOnly  className="flex items-end justify-end bg-transparent">{endContent}</Button> :  type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            aria-label="Toggle password visibility"
            className="focus:outline-none"
          >
            {isPasswordVisible ? (
              <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
            ) : (
              <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
            )}
          </button>
        )
        }
      />
    </div>
  );
}
