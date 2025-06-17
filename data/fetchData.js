import { API_URL } from "@/lib/utils";

/**
 * Ensure URL is absolute
 */
function ensureAbsoluteUrl(url) {
  if (!url) return url;
  
  // If it's already an absolute URL, return it
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Remove leading slash if present
  const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
  
  // Ensure API_URL doesn't end with a slash
  const cleanApiUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
  
  return `${cleanApiUrl}/${cleanUrl}`;
}

/**
 * Transform image URLs to absolute URLs
 */
function transformImageUrls(product) {
  if (!product?.attributes?.image?.data) return product;

  const imageData = product.attributes.image.data;
  
  if (Array.isArray(imageData)) {
    imageData.forEach(img => {
      if (img?.attributes?.url) {
        img.attributes.url = ensureAbsoluteUrl(img.attributes.url);
        
        // Transform formats URLs
        if (img.attributes.formats) {
          Object.keys(img.attributes.formats).forEach(format => {
            if (img.attributes.formats[format]?.url) {
              img.attributes.formats[format].url = ensureAbsoluteUrl(img.attributes.formats[format].url);
            }
          });
        }
      }
    });
  } else if (imageData?.attributes?.url) {
    imageData.attributes.url = ensureAbsoluteUrl(imageData.attributes.url);
    
    // Transform formats URLs
    if (imageData.attributes.formats) {
      Object.keys(imageData.attributes.formats).forEach(format => {
        if (imageData.attributes.formats[format]?.url) {
          imageData.attributes.formats[format].url = ensureAbsoluteUrl(imageData.attributes.formats[format].url);
        }
      });
    }
  }
  
  return product;
}

/**
 * Fetches product data from Strapi API
 * @returns {Promise<Array>} Array of products with their details
 */
export default async function fetchData() {
  try {
    console.log('Fetching all products...');
    console.log('Using API URL:', API_URL);
    
    const res = await fetch(`${API_URL}/api/products?populate[0]=image&populate[1]=category&populate[2]=category.image&pagination[pageSize]=1000`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      // For SSG, we want to cache the data at build time
      next: {
        revalidate: 3600 // Cache for 1 hour during build
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json();
    const products = json?.data || [];

    // Transform image URLs to absolute URLs
    const transformedProducts = products.map(product => transformImageUrls(product));

    // Log first product's image URLs for debugging
    if (transformedProducts.length > 0) {
      const firstProduct = transformedProducts[0];
      console.log('First product image URLs:', {
        main: firstProduct?.attributes?.image?.data?.attributes?.url,
        formats: firstProduct?.attributes?.image?.data?.attributes?.formats
      });
    }

    console.log(`Successfully fetched ${transformedProducts.length} products`);
    return transformedProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
    // Return empty array instead of throwing to prevent build failures
    return [];
  }
}
