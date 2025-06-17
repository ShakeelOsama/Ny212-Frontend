import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Centralized API configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://wise-book-dea9d4bff7.strapiapp.com";

/**
 * Transform Strapi product data for SSG
 */
export function transformProductForSSG(product) {
  if (!product?.attributes) return null;
  
  const { attributes } = product;
  
  return {
    id: product.id,
    name: attributes.name,
    description: attributes.description,
    price: attributes.price,
    available: attributes.available,
    slug: attributes.slug,
    image: attributes.image?.data || null,
    category: attributes.category?.data ? {
      id: attributes.category.data.id,
      name: attributes.category.data.attributes.name,
      slug: attributes.category.data.attributes.slug
    } : null
  };
}

/**
 * Transform Strapi category data for SSG
 */
export function transformCategoryForSSG(category) {
  if (!category?.attributes) return null;
  
  const { attributes } = category;
  
  return {
    id: category.id,
    name: attributes.name,
    slug: attributes.slug,
    documentId: attributes.documentId,
    image: attributes.image?.data || null,
    icon: attributes.icon?.data || null
  };
}

/**
 * Group products by category for SSG
 */
export function groupProductsByCategory(products) {
  return products.reduce((acc, product) => {
    const categoryId = product.category?.id;
    if (categoryId) {
      if (!acc[categoryId]) {
        acc[categoryId] = [];
      }
      acc[categoryId].push(product);
    }
    return acc;
  }, {});
}

/**
 * Ensure absolute URLs for images
 */
export function ensureAbsoluteUrl(url, baseUrl) {
  if (!url) return url;
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  return `${cleanBaseUrl}/${cleanUrl}`;
}
