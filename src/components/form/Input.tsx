"use client";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { EyeSlashFilledIcon } from "./EyeSlashFilledIcon";
import { EyeFilledIcon } from "./EyeFilledIcon";
import { Input as HeroUiInput } from "@heroui/react";

interface CustomInputProps {
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
}

export default function Input({
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
}: CustomInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { register, formState: { errors } } = useFormContext();

  const inputType = type === "password" && isPasswordVisible ? "text" : type;
  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);
 

  return (
    <div>
      <HeroUiInput
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
          type === "password" && (
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
