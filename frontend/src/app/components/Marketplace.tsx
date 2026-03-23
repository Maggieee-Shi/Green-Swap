import { useState, useEffect, useCallback } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Product } from "../types/product";
import { ProductCard } from "./ProductCard";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Header } from "./Header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const CATEGORIES = ["DRIVERS", "IRONS", "PUTTERS", "WEDGES", "HYBRIDS", "BAGS", "SHOES", "BALLS"];
const CONDITIONS = ["EXCELLENT", "VERY_GOOD", "GOOD", "FAIR"];
const CATEGORY_LABELS: Record<string, string> = {
  DRIVERS: "Drivers", IRONS: "Irons", PUTTERS: "Putters", WEDGES: "Wedges",
  HYBRIDS: "Hybrids", BAGS: "Bags", SHOES: "Shoes", BALLS: "Balls",
};
const CONDITION_LABELS: Record<string, string> = {
  EXCELLENT: "Excellent", VERY_GOOD: "Very Good", GOOD: "Good", FAIR: "Fair",
};

export function Marketplace() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (selectedCondition !== "all") params.set("condition", selectedCondition);
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    params.set("sort", sortBy);

    fetch(`/api/products?${params}`)
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [selectedCategory, selectedCondition, searchQuery, sortBy]);

  useEffect(() => {
    const timer = setTimeout(fetchProducts, searchQuery ? 300 : 0);
    return () => clearTimeout(timer);
  }, [fetchProducts, searchQuery]);

  const hasFilters = selectedCategory !== "all" || selectedCondition !== "all" || searchQuery;

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedCondition("all");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search for clubs, bags, shoes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">Filters:</span>
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{CATEGORY_LABELS[c]}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCondition} onValueChange={setSelectedCondition}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Conditions</SelectItem>
              {CONDITIONS.map((c) => (
                <SelectItem key={c} value={c}>{CONDITION_LABELS[c]}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-sm text-slate-600 mb-4">
            {products.length} {products.length === 1 ? "item" : "items"} found
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square bg-slate-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500">No products found matching your criteria.</p>
            {hasFilters && (
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
