import { Card, Image } from "@heroui/react";
import React from "react";

type PostImageGalleryProps = {
  images: string[];
};

export const PostImageGallery: React.FC<PostImageGalleryProps> = ({ images }) => {
  const handleImageClick = (index: number) => {
    console.log(`Image ${index + 1} clicked`); // Replace this with your modal logic
  };

  const handleShowAllClick = () => {
    console.log("Show all images"); // Replace this with your "view all" modal logic
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="grid gap-1">
      {images.length === 1 && (
        <Card className="w-full" radius="none">
          <Image
            radius="none"
            alt="Post"
            className="z-0 w-full h-full object-cover"
            src={images[0]}
            onClick={() => handleImageClick(0)}
          />
        </Card>
      )}

      {images.length === 2 && (
        <Card className="grid grid-cols-2 gap-1" radius="none">
          {images.map((img, idx) => (
            <Image
              key={idx}
              radius="none"
              alt={`Post ${idx + 1}`}
              className="z-0 w-full h-full object-cover"
              src={img}
              onClick={() => handleImageClick(idx)}
            />
          ))}
        </Card>
      )}

      {images.length === 3 && (
        <Card className="grid grid-cols-2 gap-1" radius="none">
          <Image
            radius="none"
            alt="Post 1"
            className="z-0 w-full h-full object-cover row-span-2"
            src={images[0]}
            onClick={() => handleImageClick(0)}
          />
          <Image
            radius="none"
            alt="Post 2"
            className="z-0 w-full h-full object-cover"
            src={images[1]}
            onClick={() => handleImageClick(1)}
          />
          <Image
            radius="none"
            alt="Post 3"
            className="z-0 w-full h-full object-cover"
            src={images[2]}
            onClick={() => handleImageClick(2)}
          />
        </Card>
      )}

      {images.length > 4 && (
        <Card className="grid grid-cols-2 gap-1" radius="none">
          {images.slice(0, 4).map((img, idx) => (
            <div key={idx} className="relative">
              <Image
                radius="none"
                alt={`Post ${idx + 1}`}
                className="z-0 w-full h-full object-cover"
                src={img}
                onClick={() => handleImageClick(idx)}
              />
              {/* Show the overlay only on the last (4th) image */}
              {idx === 3 && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white rounded-lg cursor-pointer"
                  onClick={handleShowAllClick}
                >
                  +{images.length - 4} More
                </div>
              )}
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};
