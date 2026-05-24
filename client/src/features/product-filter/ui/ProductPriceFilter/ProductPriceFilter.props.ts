export interface ProductPriceFilterProps {
  minPrice?: number;
  maxPrice?: number;
  onChange: (range: { minPrice?: number; maxPrice?: number }) => void;
  className?: string;
}
