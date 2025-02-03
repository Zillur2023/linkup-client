import { ImageUp } from "lucide-react";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { PostImageGallery } from "../post/PostImageGallery";
import { Button } from "@heroui/react";

interface LinkUpInputFileProps {
  name: string;
  label: string;
}

const LinkUpInputFile: React.FC<LinkUpInputFileProps> = ({ name, label }) => {
  const {
    control,
    reset,
    formState: { errors },
  } = useFormContext();

  const openFileDialog = () => {
    console.log("openFileDialog cliCK");
    const fileInput = document.getElementById(
      `file-input-${name}`
    ) as HTMLInputElement;
    fileInput?.click(); // Programmatically click the hidden file input
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={[]}
      render={({ field }) => {
        const handleImageUpdate = (
          event: React.ChangeEvent<HTMLInputElement>
        ) => {
          const newFiles = event.target.files
            ? Array.from(event.target.files)
            : [];
          field.onChange([...(field.value || []), ...newFiles]); // Append new files
        };

        return (
          <div>
            <div className=" mb-3">
              {/* <PostImageGallery images={field.value.map((file: File) => URL.createObjectURL(file))}
           addImage={openFileDialog} reset={reset} 
           field={field} /> */}
              <PostImageGallery
                addImage={openFileDialog}
                reset={reset}
                field={field}
              />
            </div>
            {/* <label
              htmlFor={`file-input-${name}`}
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {label}
            </label> */}
            {/* File Input */}
            <input
              id={`file-input-${name}`}
              className=" hidden"
              type="file"
              multiple
              onChange={handleImageUpdate}
            />
            {/* Trigger File Input with Icon */}
            <Button
              onClick={openFileDialog}
              className=" "
              startContent={<ImageUp />}
            >
              {label}
            </Button>

            {/* Error Message */}
            {errors[name]?.message && (
              <p className="text-red-500 text-sm mt-2">
                {errors[name]?.message as string}
              </p>
            )}
          </div>
        );
      }}
    />
  );
};

export default LinkUpInputFile;
