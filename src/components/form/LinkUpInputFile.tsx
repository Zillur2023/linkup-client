import { ImageUp } from "lucide-react";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Button } from "@heroui/react";
import { ImageGallery } from "../shared/ImageGallery";

interface LinkUpInputFileProps {
  name: string;
  label: string;
}

const LinkUpInputFile: React.FC<LinkUpInputFileProps> = ({ name, label }) => {
  const {
    control,
    reset,
    watch,
    formState: { errors },
  } = useFormContext();

  const openFileDialog = () => {
    const fileInput = document.getElementById(
      `file-input-${name}`
    ) as HTMLInputElement;
    fileInput?.click(); // Programmatically click the hidden file input
  };

  // console.log("watch(image)", watch(name));
  // console.log({ name });

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

          // console.log("newFiles[0]", newFiles[0]);
          // field.onChange([...(field.value || []), ...newFiles]);
          if (name === "images") {
            // Multiple file upload (append files)
            field.onChange([...(field.value || []), ...newFiles]);
          } else {
            // Single file upload (replace file)
            field.onChange(newFiles.length > 0 ? newFiles[0] : null);
          }
        };
        // console.log("zillurField", field?.value);
        // console.log(
        //   "field?.name !== images && field?.value?.length > 1",
        //   field?.name !== "images" && (field?.value?.length ?? 0) > 1
        // );

        return (
          <div>
            <div className=" mb-3">
              {/* <PostImageGallery images={field.value.map((file: File) => URL.createObjectURL(file))}
           addImage={openFileDialog} reset={reset} 
           field={field} /> */}
              <ImageGallery
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
              // isDisabled={
              //   field?.name !== "images" && (field?.value?.length ?? 0) > 0
              // }
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
