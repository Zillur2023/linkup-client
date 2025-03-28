import {
  Button,
  Card,
  Image,
  Modal,
  ModalContent,
  useDisclosure,
} from "@heroui/react";
import { ImageUp, X } from "lucide-react";

type ControllerField = {
  onChange: (value: File[]) => void;
  onBlur: () => void;
  value: File[];
  name: string;
  ref: React.Ref<HTMLInputElement>;
};

type ImageGalleryProps = {
  addImage?: () => void;
  reset?: () => void;
  images?: string[];
  field?: ControllerField;
};

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  addImage,
  reset,
  field,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  let imageGallery;

  if (images) {
    imageGallery = images
      ? images
      : field?.value?.map((file) =>
          typeof file === "string" ? file : URL.createObjectURL(file)
        ) || [];
  } else if (field) {
    imageGallery = field?.value
      ? Array.isArray(field.value)
        ? field.value.map((file) =>
            typeof file === "string" ? file : URL.createObjectURL(file)
          )
        : [
            typeof field.value === "string"
              ? field.value
              : URL.createObjectURL(field.value),
          ]
      : [];
  }

  console.log({ imageGallery });

  const handleImageRemove = (index: number) => {
    const updatedFiles = field?.value.filter((_, i: number) => i !== index);

    if (updatedFiles) {
      field?.onChange(updatedFiles); // Remove file by index
    }
  };

  const handleImageClick = (index: number) => {
    // console.log(`Image ${index + 1} clicked`); // Replace this with your modal logic
  };

  if (!imageGallery || imageGallery.length === 0) return null;

  return (
    <div className={`grid gap-4 ${addImage || reset ? "relative" : ""}`}>
      {field?.name === "images" && addImage && (
        <Button
          onClick={addImage}
          className=" z-10 top-2 left-2 absolute "
          radius="full"
          startContent={<ImageUp size={15} />}
          size="sm"
        >
          Add images
        </Button>
      )}
      {field?.name === "images" && reset && (
        // <Button onClick={() => reset}  isIconOnly radius="full" className="  z-10 top-2 right-2 absolute  "  size="sm">
        <Button
          onClick={() => field?.onChange([])}
          isIconOnly
          radius="full"
          className="  z-10 top-2 right-2 absolute  "
          size="sm"
        >
          <X size={20} />
        </Button>
      )}
      {imageGallery.length === 1 && (
        <div className=" flex items-center justify-center ">
          <Image
            radius="none"
            alt="Post"
            width={400}
            height={225}
            src={imageGallery[0]}
            onClick={() => handleImageClick(0)}
          />
        </div>
      )}

      {imageGallery.length === 2 && (
        <div className="grid grid-cols-2 gap-1 ">
          {imageGallery.map((img, idx) => (
            <Image
              key={idx}
              radius="none"
              alt={`Post ${idx + 1}`}
              width={400}
              height={225}
              src={img}
              onClick={() => handleImageClick(idx)}
            />
          ))}
        </div>
      )}

      {imageGallery.length === 3 && (
        <div className="grid grid-cols-3 gap-1">
          <Image
            radius="none"
            alt="Post 1"
            width={270}
            height={225}
            src={imageGallery[0]}
            onClick={() => handleImageClick(0)}
          />
          <Image
            radius="none"
            alt="Post 2"
            width={270}
            height={225}
            src={imageGallery[1]}
            onClick={() => handleImageClick(1)}
          />
          <Image
            radius="none"
            alt="Post 3"
            width={270}
            height={225}
            src={imageGallery[2]}
            onClick={() => handleImageClick(2)}
          />
        </div>
      )}

      {imageGallery.length >= 4 && (
        <div className="grid grid-cols-2 gap-1">
          {imageGallery.slice(0, 4).map((img, idx) => (
            <div key={idx} className="relative">
              <Image
                radius="none"
                alt={`Post ${idx + 1}`}
                width={400}
                height={200}
                src={img}
                onClick={() => handleImageClick(idx)}
              />
              {/* Show the overlay only on the last (4th) image */}
              {idx === 3 && imageGallery.length - 4 > 0 && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white  cursor-pointer"
                  // onPress={onOpen}
                  role="button" // Adds accessibility for keyboard navigation
                  tabIndex={0} // Makes it focusable
                  onClick={(e) => {
                    e.stopPropagation(); // Stop event from bubbling to parent button
                    onOpen();
                  }}
                  onKeyDown={(e) => e.key === "Enter" && onOpen()} // Handles keyboard interaction
                >
                  +{imageGallery.length - 4} More
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal for Field Images */}
      {field && (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="4xl">
          <ModalContent>
            {(onClose) => (
              <>
                <div className="gap-2 grid grid-cols-2 sm:grid-cols-4 p-3">
                  {field?.value.map((file, index) => (
                    <Card key={index} className=" relative" shadow="sm">
                      <Button
                        onClick={() => handleImageRemove(index)}
                        className=" z-20 top-2 right-2 absolute"
                        isIconOnly
                        radius="full"
                        size="sm"
                      >
                        <X size={20} />
                      </Button>
                      <Image
                        // alt={image}
                        alt={`preview-${index}`}
                        className="w-[240px] object-cover h-[140px]"
                        radius="lg"
                        shadow="sm"
                        // src={image}
                        // src={URL.createObjectURL(file)}
                        src={
                          typeof file === "string"
                            ? file
                            : URL.createObjectURL(file)
                        }
                        width="100%"
                      />
                    </Card>
                  ))}
                </div>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};
