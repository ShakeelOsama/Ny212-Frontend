"use client";
import { useState, useCallback, memo, useEffect } from "react";
import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { X } from "lucide-react";
import { API_URL } from "@/lib/utils";

const ProductDetail = memo(function ProductDetail({ product, isOpen, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Reset form when product changes
  useEffect(() => {
    setQuantity(1);
    setSpecialInstructions("");
  }, [product]);

  if (!product) return null;

  // Get the appropriate image URL with proper fallbacks
  const getProductImageUrl = useCallback(() => {
    try {
      if (product.image && Array.isArray(product.image) && product.image.length > 0) {
        const imageData = product.image[0];
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
  }, [product.image, API_URL]);

  // Calculate total price
  const totalPrice = product.price * quantity;

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  // Handle image load complete
  const handleImageLoad = useCallback(() => {
    setImgLoaded(true);
  }, []);

  // Handle image load error
  const handleImageError = useCallback(() => {
    console.error('Image load error for:', product.name);
    setImgError(true);
    setImgLoaded(true);
  }, [product.name]);

  const imageUrl = getProductImageUrl();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95%] max-w-[1100px] p-0 rounded-lg overflow-hidden mx-auto">
        <DialogTitle className="sr-only">Product Details</DialogTitle>
        <div className="flex flex-col md:flex-row bg-white relative min-h-[400px] md:min-h-0">
          {/* Close and Share Buttons */}
          <div className="absolute right-2 top-2 z-10 flex gap-2 md:right-4 md:top-4">
            <button 
              className="rounded-full bg-red-600 p-1.5 md:p-2 text-white hover:bg-red-700 transition-colors"
              onClick={() => {
                // Share functionality
                if (navigator.share) {
                  navigator.share({
                    title: product.name,
                    text: product.description,
                    url: window.location.href
                  });
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="md:w-5 md:h-5">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                <polyline points="16 6 12 2 8 6"/>
                <line x1="12" y1="2" x2="12" y2="15"/>
              </svg>
            </button>
            <DialogClose className="rounded-full bg-red-600 p-1.5 md:p-2 text-white hover:bg-red-700 transition-colors">
              <X className="h-4 w-4 md:h-5 md:w-5" />
            </DialogClose>
          </div>

          {/* Left Side - Image */}
          <div className="w-full md:w-1/2">
            <div className="relative w-full aspect-[4/3] md:aspect-square rounded-lg overflow-hidden bg-gray-100">
              {imageUrl && !imgError ? (
                <>
                  {!imgLoaded && (
                    <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                  )}
                  <Image
                    src={imageUrl}
                    alt={product.name || 'Product image'}
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    className={`transition-opacity duration-300 object-cover ${
                      imgLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    priority
                    quality={85}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                </>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  <span>No image available</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 space-y-4 md:space-y-6 max-h-[400px] md:max-h-[650px] overflow-y-auto">
            {/* Title */}
            <h2 className="text-2xl sm:text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h2>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              {product.originalPrice && (
                <span className="text-lg sm:text-xl text-gray-500 line-through">
                  Rs. {product.originalPrice}
                </span>
              )}
              <span className="text-xl sm:text-2xl font-semibold text-black">
                Rs. {product.price}
              </span>
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg text-gray-600">{product.description}</p>

            {/* Special Instructions */}
            <div className="space-y-2 md:space-y-3">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                Special Instructions
              </h3>
              <textarea
                rows={4}
                className="w-full rounded-lg border border-gray-300 p-3 md:p-4 text-gray-600 text-base sm:text-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 resize-none"
                placeholder="Please enter instructions about this item"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
              />
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
              <div className="flex items-center w-full sm:w-auto">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="h-10 w-12 sm:w-10 flex items-center justify-center text-white bg-gray-400 hover:bg-gray-500 rounded-l-full transition-colors"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="w-20 sm:w-12 text-center text-lg font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="h-10 w-12 sm:w-10 flex items-center justify-center text-white bg-red-600 hover:bg-red-700 rounded-r-full transition-colors"
                >
                  +
                </button>
              </div>

              <button
                className="w-full sm:flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-base sm:text-lg font-semibold rounded-full transition-colors flex items-center justify-between px-6"
                onClick={() => {
                  // Add to cart logic here
                  onClose();
                }}
                disabled={!product.available}
              >
                <span>Add to Cart</span>
                <span>Rs. {totalPrice}</span>
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

ProductDetail.displayName = 'ProductDetail';

export default ProductDetail; 