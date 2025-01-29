"use client";
import { ReactNode, useEffect, useState } from "react";
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
  // focusRef?: React.Ref<HTMLInputElement>; 
  focusRef?: (el: HTMLInputElement | null) => void;
  endContent?: ReactNode;
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
  endContent
}: LinkUpTextareaProps) {
  const { register, watch, formState: { errors } } = useFormContext();


  return (
    <div className="relative w-full bg-default-100 rounded-lg ">
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
        className={` ${!watch(name)? "":"pb-9"} `} 
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
