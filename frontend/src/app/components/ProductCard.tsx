import { Link } from "react-router";
import { MapPin } from "lucide-react";
import { Product, displayCondition, conditionColor } from "../types/product";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/product/${product.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="aspect-square overflow-hidden bg-slate-100">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300 text-4xl">⛳</div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-slate-900 line-clamp-2 flex-1">
              {product.name}
            </h3>
            <Badge className={conditionColor(product.condition)} variant="outline">
              {displayCondition(product.condition)}
            </Badge>
          </div>
          {product.brand && <p className="text-sm text-slate-600 mb-2">{product.brand}</p>}
          <p className="text-2xl font-bold text-slate-900 mb-2">
            ${typeof product.price === "number" ? product.price.toFixed(2) : product.price}
          </p>
          {product.location && (
            <div className="flex items-center text-sm text-slate-500">
              <MapPin className="h-4 w-4 mr-1" />
              {product.location}
            </div>
          )}
          {product.sold && (
            <Badge className="mt-2 bg-slate-100 text-slate-600 border-slate-200" variant="outline">
              Sold
            </Badge>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
