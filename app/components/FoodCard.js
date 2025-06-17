"use client";
import { useState, useCallback, memo } from "react";
import Image from "next/image";
import ProductDetail from "@/app/components/ProductDetail";
import { useRouter, useSearchParams } from "next/navigation";
import { API_URL } from "@/lib/utils";

const FoodCard = memo(function FoodCard({ food, priority }) {
  const [showDetail, setShowDetail] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check if this product is currently selected
  const isSelected = searchParams.get('product') === food.slug;

  const handleCardClick = () => {
    if (food.available) {
      // Use replace with scroll: false to maintain position
      router.replace(`?product=${food.slug}`, { scroll: false });
      setShowDetail(true);
    }
  };

  const handleClose = () => {
    // Use replace with scroll: false to maintain position
    router.replace('/', { scroll: false });
    setShowDetail(false);
  };

  // Format price with commas
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(food.price);

  // Handle image load complete
  const handleImageLoad = useCallback(() => {
    setImgLoaded(true);
  }, []);

  // Handle image load error
  const handleImageError = useCallback(() => {
    console.error('Image load error for:', food.name);
    setImgError(true);
    setImgLoaded(true);
  }, [food.name]);

  // Get the appropriate image URL with proper fallbacks
  const getProductImageUrl = useCallback(() => {
    try {
      if (food.image && Array.isArray(food.image) && food.image.length > 0) {
        const imageData = food.image[0];
        if (imageData.formats?.large?.url) {
          return imageData.formats.large.url.startsWith('http') 
            ? imageData.formats.large.url 
            : `${API_URL}${imageData.formats.large.url}`;
        } else if (imageData.url) {
          return imageData.url.startsWith('http') 
            ? imageData.url 
            : `${API_URL}${imageData.url}`;
        }
      }
    } catch (error) {
      console.error('Error getting product image URL:', error);
    }
    return null;
  }, [food.image, API_URL]);

  const imageUrl = getProductImageUrl();

  return (
    <>
      <div
        onClick={handleCardClick}
        className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col items-center text-center pb-3 sm:pb-4 md:pb-6 pt-0 px-0 border-2 border-transparent 
        transition-all duration-200 relative hover:border-red-500 hover:bg-red-50 group
        hover:scale-[1.02] hover:shadow-xl cursor-pointer h-full w-full"
      >
        {/* Availability Badge */}
        {!food.available && (
          <div className="absolute top-2 right-2 z-10 bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
            Out of Stock
          </div>
        )}

        {/* Image Container */}
        <div className="relative w-full aspect-square">
          {imageUrl && !imgError ? (
            <>
              {!imgLoaded && (
                <div className="absolute inset-0 bg-gray-100 animate-pulse" />
              )}
              <Image
                src={imageUrl}
                alt={food.name || 'Product image'}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={`transition-opacity duration-300 object-cover ${
                  imgLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                priority={priority}
                quality={85}
                onLoad={handleImageLoad}
                onError={handleImageError}
                loading={priority ? 'eager' : 'lazy'}
              />
            </>
          ) : (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No image</span>
            </div>
          )}
        </div>

        <div className="px-2 sm:px-3 md:px-4 pt-2 sm:pt-3 md:pt-4 w-full flex flex-col flex-grow">
          {/* Title */}
          <h2 
            className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 line-clamp-1 hover:line-clamp-none" 
            title={food.name}
          >
            {food.name}
          </h2>

          {/* Description */}
          {food.description && (
            <p 
              className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-2 sm:mb-3 flex-grow"
              title={food.description}
            >
              {food.description}
            </p>
          )}

          {/* Price and Action */}
          <div className="mt-auto space-y-2 sm:space-y-3">
            <p className="text-xs sm:text-sm font-semibold text-white bg-red-600 rounded-full px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 inline-block">
              {formattedPrice}
            </p>

            <button
              className={`w-full py-1.5 sm:py-2 md:py-2.5 text-xs sm:text-sm md:text-base font-semibold rounded-full transition-all duration-200 ${
                food.available
                  ? "bg-red-600 hover:bg-red-700 text-white transform hover:scale-[1.02]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!food.available}
              aria-label={food.available ? `Add ${food.name} to cart` : `${food.name} is out of stock`}
            >
              {food.available ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        </div>
      </div>

      <ProductDetail
        product={food}
        isOpen={showDetail || isSelected}
        onClose={handleClose}
      />
    </>
  );
});

FoodCard.displayName = 'FoodCard';

export default FoodCard;