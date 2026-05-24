export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface CategoryDTO {
  name: string;
}

export interface DeleteCategoryResponse {
  message: string;
}
