export interface Product {
  id: string;
  name: string;
  price: number;
  condition: string;   // EXCELLENT, VERY_GOOD, GOOD, FAIR
  category: string;   // DRIVERS, IRONS, PUTTERS, etc.
  brand: string | null;
  description: string | null;
  imageUrl: string | null;
  location: string | null;
  sellerName: string | null;
  sellerId: string | null;
  inventory: number;
  sold: boolean;
  createdAt: string | null;
}

export function displayCondition(condition: string): string {
  return condition.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export function displayCategory(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
}

export function conditionColor(condition: string): string {
  switch (condition) {
    case "EXCELLENT": return "bg-green-100 text-green-800 border-green-200";
    case "VERY_GOOD": return "bg-blue-100 text-blue-800 border-blue-200";
    case "GOOD":      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "FAIR":      return "bg-orange-100 text-orange-800 border-orange-200";
    default:          return "bg-slate-100 text-slate-800 border-slate-200";
  }
}
