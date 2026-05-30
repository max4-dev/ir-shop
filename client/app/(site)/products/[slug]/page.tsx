import { serverProductQuery } from "@/src/entities/product/api";
import { ProductDetailPage } from "@/src/pages/product/ui";

export async function generateStaticParams() {
  const data = await serverProductQuery.getAll();
  return data.products.map((product) => ({
    slug: product.slug,
  }));
}

const ProductDetail = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const product = await serverProductQuery.getBySlug(slug);
  return <ProductDetailPage product={product} />;
};

export default ProductDetail;
