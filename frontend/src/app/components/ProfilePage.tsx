import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Package,
  MessageCircle,
  ShoppingBag,
  Plus,
  CheckCircle,
  LogOut,
  ChevronRight,
  Calendar,
  MapPin,
  Trash2,
} from "lucide-react";
import { Header } from "./Header";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { toast } from "sonner";
import { apiFetch } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

interface Listing {
  id: string;
  name: string;
  price: number;
  category: string;
  condition: string;
  imageUrl: string | null;
  sold: boolean;
  inventory: number;
}

interface Order {
  id: string;
  items: Array<{ product: { id: string; name: string; image: string; price: number }; quantity: number }>;
  total: number;
  date: string;
  status: string;
  shippingAddress: { address: string; city: string; state?: string; zipCode: string };
}

interface Conversation {
  id: string;
  productId: string;
  productName: string;
  productImageUrl: string | null;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  lastMessageAt: string | null;
}

function getStatusBadgeClass(status: string) {
  switch (status.toLowerCase()) {
    case "delivered": return "bg-green-50 text-green-700 border-green-200";
    case "shipped": return "bg-blue-50 text-blue-700 border-blue-200";
    case "confirmed": return "bg-purple-50 text-purple-700 border-purple-200";
    case "cancelled": return "bg-red-50 text-red-700 border-red-200";
    default: return "bg-yellow-50 text-yellow-700 border-yellow-200";
  }
}

function formatDate(dt: string) {
  return new Date(dt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatTime(dt: string | null) {
  if (!dt) return "";
  const date = new Date(dt);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
  if (diffDays === 0) return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return date.toLocaleDateString("en-US", { weekday: "short" });
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [loadingConvs, setLoadingConvs] = useState(true);

  useEffect(() => {
    apiFetch<Listing[]>("/products/my")
      .then(setListings)
      .catch(() => toast.error("Failed to load listings"))
      .finally(() => setLoadingListings(false));

    apiFetch<Conversation[]>("/conversations")
      .then(setConversations)
      .catch(() => {})
      .finally(() => setLoadingConvs(false));

    // Orders are still in localStorage
    const stored = JSON.parse(localStorage.getItem("orders") || "[]");
    stored.sort((a: Order, b: Order) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setOrders(stored);
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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Profile header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <span className="text-2xl font-bold text-green-700">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{user?.name}</h1>
              <p className="text-slate-500 text-sm">{user?.email}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="selling">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="selling" className="flex-1">
              <ShoppingBag className="mr-1.5 h-4 w-4" />
              Selling ({listings.length})
            </TabsTrigger>
            <TabsTrigger value="buying" className="flex-1">
              <Package className="mr-1.5 h-4 w-4" />
              Buying ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex-1">
              <MessageCircle className="mr-1.5 h-4 w-4" />
              Messages ({conversations.length})
            </TabsTrigger>
          </TabsList>

          {/* ── Selling tab ── */}
          <TabsContent value="selling">
            <div className="flex justify-end mb-4">
              <Link to="/sell">
                <Button size="sm">
                  <Plus className="mr-1.5 h-4 w-4" />
                  New Listing
                </Button>
              </Link>
            </div>
            {loadingListings ? (
              <p className="text-center py-8 text-slate-400">Loading…</p>
            ) : listings.length === 0 ? (
              <Card>
                <CardContent className="p-10 text-center">
                  <ShoppingBag className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                  <p className="font-medium text-slate-700 mb-1">No listings yet</p>
                  <p className="text-sm text-slate-500 mb-4">Start selling your golf gear</p>
                  <Link to="/sell">
                    <Button size="sm">
                      <Plus className="mr-1.5 h-4 w-4" />
                      Create Listing
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {listings.map((listing) => (
                  <Card key={listing.id} className={listing.sold ? "opacity-60" : ""}>
                    <CardContent className="p-0">
                      <div className="flex items-stretch">
                        <div className="w-20 shrink-0 bg-slate-100 rounded-l-lg overflow-hidden">
                          {listing.imageUrl ? (
                            <img src={listing.imageUrl} alt={listing.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-6 w-6 text-slate-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 p-3 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <Link to={`/product/${listing.id}`}>
                              <p className="font-semibold text-slate-900 hover:text-green-700 truncate text-sm">
                                {listing.name}
                              </p>
                            </Link>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {listing.condition?.replace("_", " ")}
                            </p>
                            <p className="text-base font-bold text-slate-900 mt-0.5">
                              ${typeof listing.price === "number" ? listing.price.toFixed(2) : listing.price}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {listing.sold ? (
                              <Badge className="bg-slate-100 text-slate-600 border-slate-200" variant="outline">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Sold
                              </Badge>
                            ) : (
                              <>
                                <Badge className="bg-green-50 text-green-700 border-green-200 text-xs" variant="outline">
                                  Active
                                </Badge>
                                <Button size="sm" variant="outline" className="text-xs h-7 px-2"
                                  onClick={() => markAsSold(listing.id)}>
                                  Mark Sold
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => deleteListing(listing.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── Buying tab ── */}
          <TabsContent value="buying">
            {orders.length === 0 ? (
              <Card>
                <CardContent className="p-10 text-center">
                  <Package className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                  <p className="font-medium text-slate-700 mb-1">No orders yet</p>
                  <p className="text-sm text-slate-500 mb-4">Browse the marketplace to find gear</p>
                  <Link to="/">
                    <Button size="sm">Browse Products</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => {
                  const firstItem = order.items[0];
                  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
                  return (
                    <Link key={order.id} to={`/orders/${order.id}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                        <CardContent className="p-0">
                          <div className="flex items-stretch">
                            <div className="w-20 shrink-0 bg-slate-100 rounded-l-lg overflow-hidden">
                              {firstItem?.product.image ? (
                                <img src={firstItem.product.image} alt={firstItem.product.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="h-6 w-6 text-slate-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 p-3">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">#{order.id}</p>
                                  <p className="font-semibold text-slate-900 text-sm truncate mt-0.5">
                                    {firstItem?.product.name}
                                    {order.items.length > 1 && (
                                      <span className="text-slate-400 font-normal"> +{order.items.length - 1}</span>
                                    )}
                                  </p>
                                  <p className="text-xs text-slate-500">{itemCount} item{itemCount !== 1 ? "s" : ""}</p>
                                </div>
                                <p className="font-bold text-slate-900 shrink-0">${order.total.toFixed(2)}</p>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(order.date)}
                                  <MapPin className="h-3 w-3 ml-1" />
                                  {order.shippingAddress.city}
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Badge variant="outline" className={`text-xs capitalize ${getStatusBadgeClass(order.status)}`}>
                                    {order.status}
                                  </Badge>
                                  <ChevronRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-slate-500" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* ── Messages tab ── */}
          <TabsContent value="messages">
            {loadingConvs ? (
              <p className="text-center py-8 text-slate-400">Loading…</p>
            ) : conversations.length === 0 ? (
              <Card>
                <CardContent className="p-10 text-center">
                  <MessageCircle className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                  <p className="font-medium text-slate-700 mb-1">No messages yet</p>
                  <p className="text-sm text-slate-500">Conversations with buyers and sellers appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {conversations.map((conv) => {
                  const isbuyer = user?.id === conv.buyerId;
                  const otherName = isbuyer ? conv.sellerName : conv.buyerName;
                  return (
                    <Link key={conv.id} to={`/conversations/${conv.id}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 shrink-0 bg-slate-100 rounded-lg overflow-hidden">
                              {conv.productImageUrl ? (
                                <img src={conv.productImageUrl} alt={conv.productName} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="h-4 w-4 text-slate-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="font-semibold text-slate-900 text-sm">{otherName}</p>
                                <p className="text-xs text-slate-400">{formatTime(conv.lastMessageAt)}</p>
                              </div>
                              <p className="text-xs text-slate-500 truncate">{conv.productName}</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-300 shrink-0" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Separator className="my-8" />
        <p className="text-center text-xs text-slate-400">Member since {user ? new Date().getFullYear() : ""}</p>
      </div>
    </div>
  );
}
