import { Image } from "@heroui/react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface ChatMessageImagesProps {
  images: string[] | File[];
  className?: string;
  isCurrentUser?: boolean;
}

const ChatMessageImages = ({
  images,
  className = "",
  isCurrentUser = false,
}: ChatMessageImagesProps) => {
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [filePreviews, setFilePreviews] = useState<Record<number, string>>({});

  // Memoize filtered images to prevent unnecessary recalculations
  const filteredImages = useMemo(() => {
    if (!images) return [];
    return images.filter((img) => {
      if (typeof img === "string") return img && img.trim() !== "";
      return img instanceof File;
    });
  }, [images]);

  // Create stable object URLs for File objects
  useEffect(() => {
    const newPreviews: Record<number, string> = {};
    let needsUpdate = false;

    filteredImages.forEach((img, index) => {
      if (typeof img !== "string" && !filePreviews[index]) {
        newPreviews[index] = URL.createObjectURL(img);
        needsUpdate = true;
      }
    });

    if (needsUpdate) {
      setFilePreviews((prev) => ({ ...prev, ...newPreviews }));
    }

    return () => {
      Object.values(newPreviews).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [filteredImages]);

  // Memoized event handlers to prevent unnecessary recreations
  const handleImageClick = useCallback((index: number) => {
    setCurrentImageIndex(index);
    setCarouselOpen(true);
  }, []);

  const closeCarousel = useCallback(() => {
    setCarouselOpen(false);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? filteredImages.length - 1 : prev - 1
    );
  }, [filteredImages.length]);

  const goToNext = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === filteredImages.length - 1 ? 0 : prev + 1
    );
  }, [filteredImages.length]);

  // Get the URL for an image (string or File)
  const getImageUrl = useCallback(
    (image: string | File, index: number): string | null => {
      return typeof image === "string" ? image : filePreviews[index] || null;
    },
    [filePreviews]
  );

  // Memoized carousel render to prevent unnecessary re-renders
  const renderCarousel = useMemo(() => {
    if (!carouselOpen) return null;

    const currentImage = filteredImages[currentImageIndex];
    const imageUrl = getImageUrl(currentImage, currentImageIndex);

    if (!imageUrl) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
        <button
          onClick={closeCarousel}
          className="absolute top-4 right-4 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70"
        >
          <FiX size={24} />
        </button>

        <button
          onClick={goToPrev}
          className="absolute left-4 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70"
        >
          <FiChevronLeft size={24} />
        </button>

        <div className="max-w-4xl max-h-[90vh] relative">
          <Image
            src={imageUrl}
            width={1200}
            height={1200}
            alt={`Chat image ${currentImageIndex + 1} of ${
              filteredImages.length
            }`}
            className="object-contain w-full h-full rounded"
            style={{ maxHeight: "90vh" }}
          />

          <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">
            {currentImageIndex + 1} / {filteredImages.length}
          </div>
        </div>

        <button
          onClick={goToNext}
          className="absolute right-4 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70"
        >
          <FiChevronRight size={24} />
        </button>
      </div>
    );
  }, [
    carouselOpen,
    currentImageIndex,
    filteredImages,
    getImageUrl,
    closeCarousel,
    goToPrev,
    goToNext,
  ]);

  // Single image component
  const RenderImage = useCallback(
    ({
      image,
      index,
      className = "",
    }: {
      image: string | File;
      index: number;
      className?: string;
    }) => {
      const url = getImageUrl(image, index);
      if (!url) return null;

      return (
        <div
          className={`relative overflow-hidden cursor-pointer ${className}`}
          onClick={() => handleImageClick(index)}
        >
          <Image
            src={url}
            width={400}
            height={400}
            radius="none"
            alt={`Chat image ${index + 1}`}
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>
      );
    },
    [getImageUrl, handleImageClick]
  );

  if (filteredImages.length === 0) return null;

  // Single image layout
  if (filteredImages.length === 1) {
    return (
      <>
        <div
          className={`relative mt-2 rounded-lg overflow-hidden max-w-md ${className}`}
        >
          <RenderImage
            image={filteredImages[0]}
            index={0}
            className="w-full h-auto"
          />
        </div>
        {renderCarousel}
      </>
    );
  }

  // Two images layout
  if (filteredImages.length === 2) {
    return (
      <>
        <div className={`mt-2 grid grid-cols-2 gap-1 max-w-md ${className}`}>
          <RenderImage
            image={filteredImages[0]}
            index={0}
            className="row-span-2 aspect-square rounded-l-lg"
          />
          <RenderImage
            image={filteredImages[1]}
            index={1}
            className="aspect-square rounded-tr-lg rounded-br-lg"
          />
        </div>
        {renderCarousel}
      </>
    );
  }

  // Three images layout
  if (filteredImages.length === 3) {
    return (
      <>
        <div className={`mt-2 flex gap-1 max-w-md ${className}`}>
          <RenderImage
            image={filteredImages[0]}
            index={0}
            className="flex-[2] aspect-square rounded-l-lg"
          />
          <div className="flex-1 flex flex-col gap-1">
            <RenderImage
              image={filteredImages[1]}
              index={1}
              className="aspect-square rounded-tr-lg"
            />
            <RenderImage
              image={filteredImages[2]}
              index={2}
              className="aspect-square rounded-br-lg"
            />
          </div>
        </div>
        {renderCarousel}
      </>
    );
  }

  // Four or more images layout
  return (
    <>
      <div className={`mt-2 grid grid-cols-2 gap-1 max-w-md ${className}`}>
        {filteredImages.slice(0, 4).map((image, i) => (
          <div
            key={i}
            className={`aspect-square relative ${
              i === 0 ? "rounded-tl-lg" : ""
            } ${i === 1 ? "rounded-tr-lg" : ""}
            ${i === 2 ? "rounded-bl-lg" : ""}
            ${i === 3 ? "rounded-br-lg" : ""}`}
          >
            <RenderImage
              image={image}
              index={i}
              className={`w-full h-full ${i === 0 ? "rounded-tl-lg" : ""} ${
                i === 1 ? "rounded-tr-lg" : ""
              }
              ${i === 2 ? "rounded-bl-lg" : ""}
              ${i === 3 ? "rounded-br-lg" : ""}`}
            />
            {i === 3 && filteredImages.length > 4 && (
              <div className="absolute inset-0 z-10 bg-black bg-opacity-60 flex items-center justify-center text-white font-bold text-2xl rounded-br-lg pointer-events-none">
                +{filteredImages.length - 4}
              </div>
            )}
          </div>
        ))}
      </div>
      {renderCarousel}
    </>
  );
};

export default ChatMessageImages;
