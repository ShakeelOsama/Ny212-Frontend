"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import { Suspense } from "react";
import fetchData from "@/data/fetchData";
import fetchCategories from "@/app/components/fetchCategories";
import CategoryCarousel from "@/app/components/CategoryCarousel";
import SearchBar from "@/app/components/SearchBar";
import GroupedProductSections from "@/app/components/GroupedProductSections";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export default function HomePageClient({ initialData }) {
  const [products, setProducts] = useState(initialData.products || []);
  const [categories, setCategories] = useState(initialData.categories || []);
  const [groupedProducts, setGroupedProducts] = useState(initialData.groupedProducts || {});
  const [loading, setLoading] = useState(false); // Start with false since we have initial data
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const sectionRefs = useRef({});

  // Add scroll to top handler
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Handle scroll event to show/hide button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle search
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    
    if (!term) {
      // Reset to original grouping if search is cleared
      const originalGrouped = products.reduce((acc, product) => {
        const categoryId = product.category?.id;
        if (categoryId) {
          if (!acc[categoryId]) {
            acc[categoryId] = [];
          }
          acc[categoryId].push(product);
        }
        return acc;
      }, {});
      setGroupedProducts(originalGrouped);
      return;
    }

    // Filter and group products based on search term
    const searchLower = term.toLowerCase();
    const filteredGrouped = products.reduce((acc, product) => {
      if (
        product.name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower)
      ) {
        const categoryId = product.category?.id;
        if (categoryId) {
          if (!acc[categoryId]) {
            acc[categoryId] = [];
          }
          acc[categoryId].push(product);
        }
      }
      return acc;
    }, {});

    setGroupedProducts(filteredGrouped);
  }, [products]);

  const handleCategory = (catId) => {
    if (sectionRefs.current[catId]) {
      sectionRefs.current[catId].scrollIntoView({ 
        behavior: "smooth", 
        block: "start" 
      });
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-red-700 py-10 px-4">
        <div className="max-w-7xl mx-auto bg-white p-6 rounded-2xl shadow-md">
          <div className="text-center py-10">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Products</h2>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-0" />
        <div className="flex flex-col items-center z-10">
          <Image
            src="/logo.webp"
            alt="Logo"
            width={110}
            height={110}
            className="mb-4 animate-pulse"
            priority
          />
          <span className="text-red-700 text-lg font-semibold">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-red-700 pt-0 pb-6 px-2 sm:px-4 md:px-6 lg:px-8">
        {/* Red header with centered logo in rounded container */}
        <div className="relative w-full flex justify-center">
          {/* Red bar (header background) */}
          <div className="w-full h-8 bg-red-700"></div>
          {/* Centered logo in rounded red container */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-24 sm:w-32 md:w-36 h-20 sm:h-24 md:h-28 bg-red-700 rounded-b-3xl flex justify-center items-start shadow-lg">
            <button onClick={() => window.location.reload()} className="focus:outline-none w-full flex justify-center items-center">
              <Image
                src="/logo.webp"
                alt="Logo"
                width={120}
                height={120}
                className="object-contain mt-2 sm:mt-3 w-16 sm:w-24 md:w-28 h-auto"
                priority
              />
            </button>
          </div>
        </div>
        {/* Main white container */}
        <div className="w-full bg-white p-3 sm:p-4 md:p-6 lg:p-8 rounded-2xl shadow-md">
          {/* Top action bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2">
            {/* Left: Location & Phone */}
            <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 w-full sm:w-auto">
              {/* Location */}
              <button
                className="flex items-center bg-red-700 text-white font-semibold rounded-2xl px-2.5 sm:px-4 py-1.5 sm:py-2 text-[0.7rem] sm:text-sm md:text-base shadow hover:bg-red-800 transition w-full xs:w-auto"
                aria-label="Change Location"
              >
                <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-1.5 sm:mr-2 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/>
                </svg>
                <span className="whitespace-nowrap text-[0.7rem] sm:text-sm md:text-base">COMSATS UNIVERSITY LAHORE</span>
              </button>
              {/* Phone */}
              <button
                className="flex items-center bg-red-700 text-white font-semibold rounded-2xl px-2.5 sm:px-4 py-1.5 sm:py-2 text-[0.7rem] sm:text-sm md:text-base shadow hover:bg-red-800 transition w-full xs:w-auto"
                aria-label="Call for an order"
              >
                <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-1.5 sm:mr-2 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92V19a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h2.09a2 2 0 0 1 2 1.72c.13.81.36 1.6.68 2.34a2 2 0 0 1-.45 2.11l-.27.27a16 16 0 0 0 6.29 6.29l.27-.27a2 2 0 0 1 2.11-.45c.74.32 1.53.55 2.34.68A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span className="flex flex-col items-start leading-none">
                  <span className="text-[0.65rem] sm:text-xs md:text-sm">Call for an order</span>
                  <span className="font-bold text-[0.7rem] sm:text-sm md:text-base">04211111111</span>
                </span>
              </button>
            </div>
            {/* Right: Sign in/Register, Cart, Menu */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {/* Sign in/Register */}
              <button
                className="border border-red-700 text-red-700 font-semibold rounded-md px-2.5 sm:px-4 py-1.5 sm:py-2 text-[0.7rem] sm:text-sm md:text-base hover:bg-red-50 transition flex-1 sm:flex-none text-center"
                aria-label="Sign in or Register"
              >
                Sign in / Register
              </button>
              {/* Cart */}
              <button className="relative bg-red-700 text-white rounded-md p-1.5 sm:p-2 hover:bg-red-800 transition min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center" aria-label="Cart">
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007.5 17h9a1 1 0 00.85-1.53L17 13M7 13V6a1 1 0 011-1h5a1 1 0 011 1v7" />
                </svg>
                <span className="absolute -top-1.5 -right-1.5 bg-white text-red-700 font-bold rounded-full px-1 border border-red-700 text-[0.6rem] sm:text-xs">0</span>
              </button>
              {/* Side Drawer/Menu */}
              <button className="bg-red-700 text-white rounded-md p-1.5 sm:p-2 hover:bg-red-800 transition min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center" aria-label="Open menu">
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
          {/* Banner at the top of the inner container */}
          <div className="w-full flex justify-center mb-6 mt-8">
            <div className="w-full max-w-[1400px] px-2">
              <Image
                src="/header.webp"
                alt="Header Banner"
                width={1400}
                height={400}
                className="rounded-3xl w-full object-cover"
                priority
                quality={100}
              />
            </div>
          </div>
          {/* Category row below banner */}
          <Suspense fallback={<CategorySkeleton />}>
            <CategoryCarousel
              categories={categories}
              selectedCat={null}
              onSelect={handleCategory}
            />
          </Suspense>

          {/* Search Bar */}
          <Suspense fallback={<SearchSkeleton />}>
            <SearchBar onSearch={handleSearch} />
          </Suspense>

          {loading ? (
            <ProductsSkeleton />
          ) : (
            <Suspense fallback={<ProductsSkeleton />}>
              {Object.keys(groupedProducts).length > 0 ? (
                <GroupedProductSections
                  categories={categories}
                  groupedProducts={groupedProducts}
                  sectionRefs={sectionRefs}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-600 mb-2">No items found matching "{searchTerm}"</p>
                  <p className="text-sm text-gray-500">Try searching with different keywords</p>
                </div>
              )}
            </Suspense>
          )}

          {/* About Section */}
          <div className="mt-12 prose prose-lg max-w-none relative">
            <div className="text-center mb-32">
              <h1 className="text-4xl font-bold mb-6">
                Order Delicious and Freshly Baked Pizza at NY 212 Pizza
              </h1>
              <p className="text-gray-600 text-lg max-w-4xl mx-auto">
                At NY 212 Pizza, we bring you the authentic taste of freshly baked pizza, made with the finest ingredients and cooked to perfection. Whether you are craving a classic cheese pizza, a loaded meat lover's pizza, or a custom creation, we have something for every pizza lover. Located in Lahore, and Sargodha, we ensure that every order delivers the same great taste and quality.
              </p>
            </div>
          </div>
        </div>

        {/* Scroll to top button */}
        <button
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 bg-red-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 z-50 ${
            showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 pointer-events-none'
          }`}
          aria-label="Scroll to top"
        >
          <svg
            className="w-6 h-6 transform rotate-90"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>
    </>
  );
}

function CategorySkeleton() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-12 w-32 rounded-full" />
      ))}
    </div>
  );
}

function SearchSkeleton() {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 py-3">
      <Skeleton className="h-12 w-full rounded-full" />
    </div>
  );
}

function ProductsSkeleton() {
  return (
    <div className="space-y-8 py-8">
      {[1, 2].map((section) => (
        <div key={section} className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {[1, 2, 3, 4].map((item) => (
              <Skeleton key={item} className="h-[250px] sm:h-[280px] md:h-[300px] rounded-xl" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 