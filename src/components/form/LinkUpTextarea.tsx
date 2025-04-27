"use client";
import { ReactNode, useEffect, KeyboardEvent, useRef } from "react";
import { useFormContext } from "react-hook-form";

import { Button, Card, Textarea } from "@heroui/react";

interface LinkUpTextareaProps {
  onChange?: any;
  name: string;
  label?: string;
  minRows?: number;
  maxRows?: number;
  labelPlacement?: "outside" | "outside-left" | "inside" | undefined;
  placeholder?: string;
  required?: boolean;
  type?: "text" | "password";
  size?: "sm" | "md" | "lg";
  value?: string;
  isReadOnly?: boolean;
  className?: any;
  focusRef?: (el: HTMLTextAreaElement | null) => void;
  endContent?: ReactNode;
  onSubmit?: (data: any, reset?: () => void) => void; // Updated type
}

export default function LinkUpTextarea({
  name,
  label,
  minRows,
  maxRows,
  labelPlacement,
  placeholder,
  required = false,
  type = "text",
  size = "md",
  value,
  isReadOnly = false,
  className = "bg-default-200",
  focusRef,
  endContent,
  onSubmit,
}: LinkUpTextareaProps) {
  const {
    register,
    watch,
    reset,
    formState: { errors },
  } = useFormContext();
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  // Focus textarea when modal opens
  useEffect(() => {
    if (focusRef && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [focusRef]);
  // const onValid = (data: any) => {
  //   reset();
  // };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent default behavior (e.g., new line)
      onSubmit?.({ [name]: watch(name) }); // Pass form data to onSubmit
      // const nameValue = watch(name)
      // if(nameValue) handleSubmit()();

      reset();
    }
  };

  return (
    <Card
      shadow={minRows === 4 ? "none" : "md"}
      className={`${
        endContent ? "relative" : ""
      } w-full rounded-lg ${className} border-2 border-red-400  `}
      // } w-full rounded-lg  border-2 border-red-400  `}
    >
      <Textarea
        {...register(name)}
        label={label}
        // minRows={!watch(name) ? 1 : 2}
        // minRows={name === "content" ? 4 : 1}
        // maxRows={name === "content" ? 12 : 8}
        minRows={minRows}
        maxRows={maxRows}
        labelPlacement={labelPlacement}
        placeholder={placeholder}
        required={required}
        size={size}
        // fullWidth
        value={value}
        type={type}
        errorMessage={errors[name]?.message as string}
        isInvalid={Boolean(errors[name])}
        isReadOnly={isReadOnly}
        // ref={textAreaRef}
        ref={(el) => {
          textAreaRef.current = el;
          register(name).ref(el); // Register ref for react-hook-form
          if (focusRef) focusRef(el); // Apply focusRef as well
        }}
        // endContent={
        //  endContent && <Button isDisabled={!watch(name)} type="submit" isIconOnly  className="absolute bottom-2 right-2 bg-transparent">{endContent}</Button>
        // }
        // isClearable
        className={`${watch(name) && endContent ? "pb-8" : ""} `}
        // className={` mx-auto border-2 border-black w-[85%] `}
        onKeyDown={handleKeyDown} // Add onKeyDown handler
        variant="flat"
        classNames={{
          inputWrapper: "!bg-transparent shadow-none", // Added shadow-none here
          input: "!bg-transparent",
        }}
        // color="default"
      />
      {endContent && (
        <Button
          isDisabled={!watch(name)}
          type="submit"
          isIconOnly
          // className=" z-20 absolute bottom-0 right-1 bg-transparent "
          className=" absolute bottom-0  right-1 bg-transparent "
        >
          {endContent}
        </Button>
      )}
    </Card>
  );
}
