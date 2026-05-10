import { ProductsByCategoryPage } from "@/src/pages/product/ui";

const ProductsByCategory = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  return <ProductsByCategoryPage category={slug} />;
};

export default ProductsByCategory;
