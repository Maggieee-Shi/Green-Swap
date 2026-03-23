import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Plus, Package, CheckCircle, Trash2 } from "lucide-react";
import { Header } from "./Header";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { apiFetch } from "../lib/api";

interface Listing {
  id: string;
  name: string;
  price: number;
  category: string;
  condition: string;
  imageUrl: string | null;
  sold: boolean;
  inventory: number;
  createdAt: string;
}

export function MyListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<Listing[]>("/products/my")
      .then(setListings)
      .catch(() => toast.error("Failed to load listings"))
      .finally(() => setLoading(false));
  }, []);

  const markAsSold = async (id: string) => {
    try {
      const updated = await apiFetch<Listing>(`/products/${id}/sold`, { method: "PATCH" });
      setListings((prev) => prev.map((l) => (l.id === id ? updated : l)));
      toast.success("Marked as sold!");
    } catch {
      toast.error("Failed to mark as sold");
    }
  };

  const deleteListing = async (id: string) => {
    if (!window.confirm("Delete this listing? This cannot be undone.")) return;
    try {
      await apiFetch<void>(`/products/${id}`, { method: "DELETE" });
      setListings((prev) => prev.filter((l) => l.id !== id));
      toast.success("Listing deleted");
    } catch {
      toast.error("Failed to delete listing");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Listings</h1>
            <p className="text-slate-500 mt-1">{listings.length} item{listings.length !== 1 ? "s" : ""}</p>
          </div>
          <Link to="/sell">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Listing
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading…</div>
        ) : listings.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="mx-auto h-16 w-16 text-slate-400 mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">No listings yet</h2>
              <p className="text-slate-600 mb-6">Start selling your golf gear</p>
              <Link to="/sell">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Listing
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {listings.map((listing) => (
              <Card key={listing.id} className={listing.sold ? "opacity-60" : ""}>
                <CardContent className="p-0">
                  <div className="flex items-stretch">
                    <div className="w-24 shrink-0 bg-slate-100 rounded-l-lg overflow-hidden">
                      {listing.imageUrl ? (
                        <img
                          src={listing.imageUrl}
                          alt={listing.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-8 w-8 text-slate-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 p-4 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <Link to={`/product/${listing.id}`}>
                          <p className="font-semibold text-slate-900 hover:text-green-700 truncate">
                            {listing.name}
                          </p>
                        </Link>
                        <p className="text-sm text-slate-500 mt-0.5">
                          {listing.category} · {listing.condition?.replace("_", " ")}
                        </p>
                        <p className="text-lg font-bold text-slate-900 mt-1">
                          ${typeof listing.price === "number" ? listing.price.toFixed(2) : listing.price}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {listing.sold ? (
                          <Badge className="bg-slate-100 text-slate-600 border-slate-200" variant="outline">
                            <CheckCircle className="mr-1 h-3.5 w-3.5" />
                            Sold
                          </Badge>
                        ) : (
                          <>
                            <Badge className="bg-green-50 text-green-700 border-green-200" variant="outline">
                              Active
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markAsSold(listing.id)}
                            >
                              Mark as Sold
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => deleteListing(listing.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
