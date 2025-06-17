import { Suspense } from "react";
import fetchData from "@/data/fetchData";
import fetchCategories from "@/app/components/fetchCategories";
import HomePageClient from "@/app/components/HomePageClient";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

// Static generation function - runs at build time
export async function generateStaticParams() {
  return [];
}

// This function runs at build time to pre-render the page
export async function generateMetadata() {
  return {
    title: "NY 212 Pizza - Order Fresh & Delicious Pizza Online",
    description: "Order delicious and freshly baked pizza from NY 212 Pizza. We offer a wide variety of pizzas, sides, and beverages. Available in Lahore and Sargodha.",
    keywords: "pizza delivery, NY 212 Pizza, Lahore pizza, Sargodha pizza, online pizza ordering",
  };
}

// Static data fetching - runs at build time
async function getStaticData() {
  try {
    // Fetch both products and categories at build time
    const [productsData, categoriesData] = await Promise.all([
      fetchData(),
      fetchCategories()
    ]);
    
    // Transform products data
    const transformedProducts = productsData.map(product => ({
      id: product.id,
      name: product.attributes?.name || product.name,
      description: product.attributes?.description || product.description,
      price: product.attributes?.price || product.price,
      available: product.attributes?.available || product.available,
      image: product.attributes?.image?.data || product.image,
      category: product.attributes?.category?.data || product.category,
      slug: product.attributes?.slug || product.slug
    }));
    
    // Group products by category
    const grouped = transformedProducts.reduce((acc, product) => {
      const categoryId = product.category?.id;
      if (categoryId) {
        if (!acc[categoryId]) {
          acc[categoryId] = [];
        }
        acc[categoryId].push(product);
      }
      return acc;
    }, {});

    return {
      products: transformedProducts,
      categories: categoriesData,
      groupedProducts: grouped
    };
  } catch (error) {
    console.error("Error in static data generation:", error);
    return {
      products: [],
      categories: [],
      groupedProducts: {}
    };
  }
}

// Server component wrapper - this runs at build time
export default async function HomePage() {
  // Fetch static data at build time
  const staticData = await getStaticData();
  
  return <HomePageClient initialData={staticData} />;
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