"use client";
import FoodCard from "@/app/components/FoodCard";
import Image from "next/image";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { API_URL } from "@/lib/utils";

export default function GroupedProductSections({ categories, groupedProducts, sectionRefs }) {
  const [loadedImages, setLoadedImages] = useState({});

  // Function to get category image URL
  const getCategoryImageUrl = (category) => {
    try {
      // Handle the case where image is in attributes (new Strapi structure)
      if (category.attributes?.image?.data) {
        const imageData = category.attributes.image.data;
        if (imageData.attributes?.url) {
          return imageData.attributes.url.startsWith('http') 
            ? imageData.attributes.url 
            : `${API_URL}${imageData.attributes.url}`;
        }
      }
      
      // Handle the case where image is direct array (old structure)
      if (category.image && Array.isArray(category.image) && category.image.length > 0) {
        const imageData = category.image[0];
        if (imageData.url) {
          return imageData.url.startsWith('http') 
            ? imageData.url 
            : `${API_URL}${imageData.url}`;
        }
      }
    } catch (error) {
      console.error('Error getting category image URL:', error);
    }
    return null;
  };

  const handleImageLoad = (catId) => {
    setLoadedImages(prev => ({ ...prev, [catId]: true }));
  };

  return (
    <div className="space-y-8 sm:space-y-12 md:space-y-16">
      {categories.map((cat, categoryIndex) => {
        const imageUrl = getCategoryImageUrl(cat);
        return groupedProducts[cat.id]?.length ? (
          <section
            key={cat.id}
            ref={el => (sectionRefs.current[cat.id] = el)}
            className="mb-8 sm:mb-12 md:mb-16 last:mb-0"
            id={`category-${cat.id}`}
          >
            {/* Category Header with Image */}
            <div className="px-2 sm:px-4">
              <div className="relative w-full max-w-[1100px] mx-auto overflow-visible rounded-2xl">
                {/* Category Image */}
                {imageUrl && (
                  <div className="relative w-full">
                    {!loadedImages[cat.id] && (
                      <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-2xl" />
                    )}
                    <Image
                      src={imageUrl}
                      alt={cat.name}
                      width={1100}
                      height={300}
                      className={`transition-opacity duration-300 object-contain rounded-2xl w-full h-auto ${
                        loadedImages[cat.id] ? 'opacity-100' : 'opacity-0'
                      }`}
                      priority={categoryIndex === 0}
                      quality={100}
                      onLoad={() => handleImageLoad(cat.id)}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Products Grid */}
            <div className="mt-1 sm:mt-4 md:mt-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 w-full max-w-[1100px] mx-auto px-4 sm:px-6 md:px-8">
              {groupedProducts[cat.id].map((item, index) => (
                <FoodCard
                  key={item.id}
                  food={item}
                  priority={categoryIndex === 0 && index < 4}
                />
              ))}
            </div>
          </section>
        ) : null;
      })}
    </div>
  );
}