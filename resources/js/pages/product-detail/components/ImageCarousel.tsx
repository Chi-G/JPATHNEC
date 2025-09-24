import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

interface ImageCarouselProps {
  images: string[];
  productName: string;
}

const ImageCarousel = ({ images, productName }: ImageCarouselProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images?.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images?.length) % images?.length);
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative bg-card rounded-lg overflow-hidden aspect-square">
        <Image
          src={images?.[currentImageIndex]}
          alt={`${productName} - View ${currentImageIndex + 1}`}
          className={`w-full h-full object-cover cursor-zoom-in transition-transform duration-300 ${
            isZoomed ? 'scale-150' : 'scale-100'
          }`}
          onClick={toggleZoom}
        />

        {/* Navigation Arrows */}
        {images?.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-2 transition-hover shadow-elevation-sm"
              aria-label="Previous image"
              title="Previous image"
            >
              <Icon name="ChevronLeft" size={20} />
            </button>
            <button
              type="button"
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-2 transition-hover shadow-elevation-sm"
              aria-label="Next image"
              title="Next image"
            >
              <Icon name="ChevronRight" size={20} />
            </button>
          </>
        )}

        {/* Zoom Indicator */}
        <div className="absolute top-2 right-2 bg-background/80 rounded-full p-2">
          <Icon name={isZoomed ? "ZoomOut" : "ZoomIn"} size={16} />
        </div>

        {/* Image Counter */}
        <div className="absolute bottom-2 right-2 bg-background/80 rounded-full px-3 py-1 text-sm font-medium">
          {currentImageIndex + 1} / {images?.length}
        </div>
      </div>
      {/* Thumbnail Navigation */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {images?.map((image, index) => (
          <button
            key={index}
            type="button"
            onClick={() => selectImage(index)}
            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-hover ${
              index === currentImageIndex
                ? 'border-primary' :'border-border hover:border-primary/50'
            }`}
            aria-label={`View image ${index + 1}`}
            title={`View image ${index + 1}`}
          >
            <Image
              src={image}
              alt={`${productName} thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
