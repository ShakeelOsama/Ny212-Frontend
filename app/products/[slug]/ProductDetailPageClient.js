"use client";
import ProductDetail from '@/app/components/ProductDetail';

export default function ProductDetailPageClient({ product }) {
  return (
    <ProductDetail product={product} isOpen={true} onClose={undefined} />
  );
} 