"use client";
import { ReactNode, useEffect, useState,KeyboardEvent  } from "react";
import { useFormContext } from "react-hook-form";

import { Button, Textarea } from "@heroui/react";

interface LinkUpTextareaProps {
  name: string;
  label?: string;
  labelPlacement?: "outside" | "outside-left" | "inside" | undefined;
  placeholder?: string;
  required?: boolean;
  type?: "text" | "password";
  size?: "sm" | "md" | "lg";
  value?: string;
  isReadOnly?: boolean;
  focusRef?: (el: HTMLTextAreaElement | null) => void;
  endContent?: ReactNode;
  onSubmit?: (data: any, reset?: () => void) => void; // Updated type
}

export default function LinkUpTextarea({
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
  endContent,
  onSubmit
}: LinkUpTextareaProps) {
  const { register, watch, reset, formState: { errors } } = useFormContext();
  // console.log("focusRef", focusRef)

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent default behavior (e.g., new line)
      onSubmit?.({ [name]: watch(name) }); // Pass form data to onSubmit
      reset()
    }
  };



  return (
    <div className="relative w-full rounded-lg bg-default-100 ">
      <Textarea
        {...register(name)}
        label={label}
        minRows={!watch(name) ? 1 : 2}
        labelPlacement={labelPlacement}
        placeholder={placeholder}
        required={required}
        size={size}
        value={value}
        type={type}
        errorMessage={errors[name]?.message as string}
        isInvalid={Boolean(errors[name])}
        isReadOnly={isReadOnly}
        // ref={focusRef}
        ref={(e) => {
          register(name).ref(e); // Register ref for react-hook-form
          if (focusRef) focusRef(e); // Apply focusRef as well
        }}
        // endContent={
        //  endContent && <Button isDisabled={!watch(name)} type="submit" isIconOnly  className="absolute bottom-2 right-2 bg-transparent">{endContent}</Button> 
        // }
        // isClearable
        // onClear={() => console.log("textarea cleared")}
        className={` ${!watch(name)? "":"pb-9"}  `} 
        onKeyDown={handleKeyDown} // Add onKeyDown handler

        // color="default"
         />
           {endContent && (
    <Button
      isDisabled={!watch(name)}
      type="submit"
      isIconOnly
      className=" z-20 absolute bottom-0 right-1 bg-transparent "
      >
      {endContent}
    </Button>
  )}
    </div>
  );
}
