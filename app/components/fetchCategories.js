// fetchCategories.js
import { API_URL } from "@/lib/utils";

export default async function fetchCategories() {
  try {
    console.log('Fetching categories from:', `${API_URL}/api/categories?populate[0]=image&populate[1]=icon&populate[2]=products&populate[3]=products.image`);
    
    const res = await fetch(`${API_URL}/api/categories?populate[0]=image&populate[1]=icon&populate[2]=products&populate[3]=products.image`, {
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
    console.log('Raw categories response:', json);

    if (!json?.data) {
      console.error('Invalid category data structure received:', json);
      return [];
    }

    // Log the number of categories received
    console.log(`Received ${json.data.length} categories`);
    
    // Log each category's details including product count
    json.data.forEach((category, index) => {
      console.log(`Category ${index + 1}:`, {
        id: category.id,
        name: category.attributes?.name,
        productCount: category.attributes?.products?.data?.length || 0,
        hasImage: !!category.attributes?.image?.data
      });
    });

    // Transform the data to include necessary fields
    const categories = json.data.map(category => {
      const transformed = {
        id: category.id,
        name: category.attributes?.name || category.name,
        slug: category.attributes?.slug || category.slug,
        documentId: category.attributes?.documentId || category.documentId,
        image: category.attributes?.image?.data || category.image,
        icon: category.attributes?.icon?.data || category.icon
      };
      console.log(`Transformed category ${category.id}:`, transformed);
      return transformed;
    });

    console.log('All transformed categories:', categories);
    console.log(`Successfully fetched ${categories.length} categories`);
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Return empty array instead of throwing to prevent build failures
    return [];
  }
}
