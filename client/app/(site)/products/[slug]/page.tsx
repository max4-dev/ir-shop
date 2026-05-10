import { serverProductQuery } from "@/src/entities/product/api";
import { ProductDetailPage } from "@/src/pages/product/ui";

export async function generateStaticParams() {
  const products = await serverProductQuery.getAll();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

const ProductDetail = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  return <ProductDetailPage slug={slug} />;
};

export default ProductDetail;
