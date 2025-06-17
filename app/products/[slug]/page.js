import fetchData from '@/data/fetchData';
import ProductDetailPageClient from './ProductDetailPageClient';
import Image from 'next/image';

// Generate all product slugs at build time
export async function generateStaticParams() {
  const products = await fetchData();
  return products.map(product => ({ slug: product.attributes?.slug || product.slug }));
}

export async function generateMetadata({ params }) {
  const products = await fetchData();
  const product = products.find(
    p => (p.attributes?.slug || p.slug) === params.slug
  );
  if (!product) return { title: 'Product Not Found' };
  return {
    title: product.attributes?.name || product.name,
    description: product.attributes?.description || product.description,
  };
}

export default async function ProductPage({ params }) {
  const products = await fetchData();
  const product = products.find(
    p => (p.attributes?.slug || p.slug) === params.slug
  );

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Image src="/logo.webp" alt="Logo" width={120} height={120} className="mb-4" />
        <h1 className="text-2xl font-bold text-red-700 mb-2">Product Not Found</h1>
        <p className="text-gray-600 mb-4">Sorry, this product does not exist.</p>
      </div>
    );
  }

  // Transform product to match ProductDetail expectations
  const transformed = {
    id: product.id,
    name: product.attributes?.name || product.name,
    description: product.attributes?.description || product.description,
    price: product.attributes?.price || product.price,
    available: product.attributes?.available || product.available,
    slug: product.attributes?.slug || product.slug,
    image: product.attributes?.image?.data || product.image,
    category: product.attributes?.category?.data || product.category,
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-2xl mx-auto p-4">
        <ProductDetailPageClient product={transformed} />
      </div>
    </div>
  );
} 