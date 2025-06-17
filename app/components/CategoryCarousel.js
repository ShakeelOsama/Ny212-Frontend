"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { API_URL } from "@/lib/utils";

export default function CategoryCarousel({ categories, selectedCat, onSelect }) {
  const scrollContainerRef = useRef(null);
  const carouselRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [loadedIcons, setLoadedIcons] = useState({});
  const [isSticky, setIsSticky] = useState(false);

  // Get category icon URL
  const getCategoryIconUrl = useCallback((category) => {
    try {
      if (category.icon && Array.isArray(category.icon) && category.icon.length > 0) {
        const iconData = category.icon[0];
        if (iconData.url) {
          return iconData.url.startsWith('http')
            ? iconData.url
            : `${API_URL}${iconData.url}`;
        }
      }
    } catch (error) {
      console.error('Error getting category icon URL:', error);
    }
    return null;
  }, []);

  // Handle icon load complete
  const handleIconLoad = useCallback((catId) => {
    setLoadedIcons(prev => ({ ...prev, [catId]: true }));
  }, []);

  useEffect(() => {
    const checkScroll = () => {
      const container = scrollContainerRef.current;
      if (container) {
        setShowLeftArrow(container.scrollLeft > 0);
        setShowRightArrow(
          container.scrollLeft < container.scrollWidth - container.clientWidth
        );
      }
    };

    const handlePageScroll = () => {
      if (carouselRef.current) {
        const rect = carouselRef.current.getBoundingClientRect();
        setIsSticky(rect.top <= 0);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('scroll', handlePageScroll, { passive: true });
      // Initial checks
      checkScroll();
      handlePageScroll();
      // Check after content loads
      window.addEventListener('load', checkScroll);
      // Check on window resize
      window.addEventListener('resize', checkScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScroll);
      }
      window.removeEventListener('scroll', handlePageScroll);
      window.removeEventListener('load', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const scroll = useCallback((direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }, []);

  return (
    <div 
      ref={carouselRef}
      className={`
        sticky top-0 z-30 bg-white/95 backdrop-blur-sm transition-all duration-700
        ${isSticky ? 'py-0.5 shadow-md' : 'py-1'}
      `}
    >
      <div className="max-w-[1400px] mx-auto relative">
        {/* Categories Container */}
        <div 
          ref={scrollContainerRef}
          className={`
            flex overflow-x-auto scrollbar-none scroll-smooth
            ${isSticky ? 'gap-2' : 'gap-3'}
          `}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((cat) => {
            const iconUrl = getCategoryIconUrl(cat);
            return (
              <button
                key={cat.id}
                onClick={() => onSelect(cat.id)}
                className={`
                  flex flex-col items-center transition-all duration-700 ease-out px-2
                  ${isSticky ? 'min-w-[130px]' : 'min-w-[140px]'}
                  ${selectedCat === cat.id ? "scale-105" : "hover:scale-105"}
                `}
                aria-label={cat.name}
              >
                {/* Icon Container */}
                <div 
                  className={`
                    relative overflow-hidden transition-all duration-700 ease-out transform
                    w-16 h-16
                    ${isSticky 
                      ? 'scale-y-0 opacity-0 absolute -translate-y-full' 
                      : 'scale-y-100 opacity-100 relative translate-y-0'
                    }
                  `}
                >
                  {iconUrl && (
                    <>
                      <Image
                        src={iconUrl}
                        alt={`${cat.name} icon`}
                        fill
                        className={`
                          transition-opacity duration-700 ease-out object-contain
                          ${loadedIcons[cat.id] ? 'opacity-100' : 'opacity-0'}
                        `}
                        onLoad={() => handleIconLoad(cat.id)}
                      />
                      {!loadedIcons[cat.id] && (
                        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                      )}
                    </>
                  )}
                </div>

                {/* Category Name */}
                <span className={`
                  font-medium text-center transition-all duration-700 ease-out mt-1
                  ${isSticky 
                    ? 'text-sm font-semibold py-1 px-3 bg-white/80 rounded-full shadow-sm translate-y-0' 
                    : 'text-sm translate-y-0'
                  }
                  ${selectedCat === cat.id 
                    ? "text-red-600" 
                    : "text-gray-700 hover:text-red-600"
                  }
                  whitespace-nowrap
                `}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className={`
              absolute left-0 top-1/2 -translate-y-1/2 z-10 
              bg-gradient-to-r from-white via-white to-transparent 
              pl-1 pr-3 py-2 transition-all duration-300
              hover:opacity-100 group
            `}
            aria-label="Scroll left"
          >
            <svg
              className={`
                text-red-600 transform transition-transform 
                group-hover:-translate-x-1
                ${isSticky ? 'w-4 h-4' : 'w-5 h-5'}
              `}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className={`
              absolute right-0 top-1/2 -translate-y-1/2 z-10 
              bg-gradient-to-l from-white via-white to-transparent 
              pr-1 pl-3 py-2 transition-all duration-300
              hover:opacity-100 group
            `}
            aria-label="Scroll right"
          >
            <svg
              className={`
                text-red-600 transform transition-transform 
                group-hover:translate-x-1
                ${isSticky ? 'w-4 h-4' : 'w-5 h-5'}
              `}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}

        {/* Gradient Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
}