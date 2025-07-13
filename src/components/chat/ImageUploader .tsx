import { IoMdImages } from "react-icons/io";
import React, { forwardRef, useState, useEffect } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Avatar, Badge, Button } from "@heroui/react";

interface ImageUploaderProps {
  name: string;
}

const ImageUploader = forwardRef<HTMLInputElement, ImageUploaderProps>(
  ({ name }, ref) => {
    const {
      control,
      formState: { errors },
    } = useFormContext();
    const watchedImages = useWatch({ name, control });
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    // Initialize with existing values
    // useEffect(() => {
    //   const currentValue = control._formValues[name];
    //   if (currentValue && currentValue.length > 0) {
    //     if (typeof currentValue[0] === "string") {
    //       setPreviewUrls(currentValue);
    //     } else {
    //       setPreviewUrls(
    //         currentValue.map((file: File) => URL.createObjectURL(file))
    //       );
    //     }
    //   }
    // }, [control._formValues, name]);

    useEffect(() => {
      if (!watchedImages || watchedImages.length === 0) {
        setPreviewUrls([]);
      }
    }, [watchedImages]);

    return (
      <Controller
        name={name}
        control={control}
        defaultValue={[]}
        render={({ field }) => {
          // Move these functions inside the render prop where field is available
          const handleImageUpdate = (
            event: React.ChangeEvent<HTMLInputElement>
          ) => {
            const newFiles = event.target.files
              ? Array.from(event.target.files)
              : [];

            if (newFiles.length > 0) {
              const newPreviewUrls = newFiles.map((file) =>
                URL.createObjectURL(file)
              );
              setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);

              const updatedFiles = [...(field.value || []), ...newFiles];
              field.onChange(updatedFiles);
            }
          };

          const handleRemoveImage = (index: number) => {
            if (previewUrls[index].startsWith("blob:")) {
              URL.revokeObjectURL(previewUrls[index]);
            }

            const updatedPreviews = [...previewUrls];
            updatedPreviews.splice(index, 1);
            setPreviewUrls(updatedPreviews);

            const updatedFiles = [...field.value];
            updatedFiles.splice(index, 1);
            field.onChange(updatedFiles);
          };

          const handleButtonClick = () => {
            if (ref && "current" in ref) {
              ref.current?.click();
            }
          };

          return (
            <div className="space-y-3">
              {/* Scrollable Image Previews */}
              {previewUrls.length > 0 && (
                <div className="relative">
                  <div className="flex pt-1  gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {/* <Button
                      onClick={handleButtonClick}
                      isIconOnly
                      variant="solid"
                      size="lg"
                      radius="md"
                      aria-label="Add more images"
                      className=" ml-2 mt-1 "
                    >
                      <IoMdImages size={32} />
                    </Button> */}
                    <Avatar
                      as={Button}
                      isIconOnly
                      onClick={handleButtonClick}
                      radius="md"
                      size="md"
                      icon={<IoMdImages size={24} />}
                      className=" ml-2"
                    />
                    {previewUrls.map((url, index) => (
                      <div key={index} className="flex-shrink-0 relative group">
                        <Badge
                          onClick={() => handleRemoveImage(index)}
                          color="default"
                          content={"x"}
                        >
                          <Avatar radius="md" size="md" src={url} />
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Permanent Add Image Button */}
              <Button
                onClick={handleButtonClick}
                startContent={<IoMdImages size={18} />}
                variant="light"
                size="md"
                radius="full"
                aria-label="Add more images"
                className=" hidden"
              >
                Add Images
              </Button>

              {/* Hidden File Input */}
              <input
                ref={ref}
                className="hidden"
                type="file"
                multiple={name === "images"}
                accept="image/*"
                onChange={handleImageUpdate}
              />

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
  }
);

ImageUploader.displayName = "ImageUploader"; // ✅ Fix the ESLint error

export default ImageUploader;
