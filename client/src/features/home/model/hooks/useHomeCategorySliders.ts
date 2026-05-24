import { useQueries } from "@tanstack/react-query";

import { productQuery } from "@/src/entities/product/api";
import { HOME_SLIDER_LIMIT } from "@/src/entities/product/config";
import { useCategories } from "@/src/entities/category/model";

export const useHomeCategorySliders = () => {
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();

  const categoryQueries = useQueries({
    queries: (categories ?? []).map((category) => ({
      queryKey: ["products", "category", category.slug, { limit: HOME_SLIDER_LIMIT }],
      queryFn: () => productQuery.getByCategory(category.slug, { limit: HOME_SLIDER_LIMIT }),
      enabled: Boolean(categories?.length),
    })),
  });

  const sliders = (categories ?? [])
    .map((category, index) => {
      const query = categoryQueries[index];
      const products = query?.data?.products ?? [];

      return {
        category,
        products,
        isLoading: query?.isLoading ?? false,
      };
    })
    .filter((item) => item.products.length > 0);

  return {
    sliders,
    isCategoriesLoading,
    isProductsLoading: categoryQueries.some((query) => query.isLoading),
  };
};
