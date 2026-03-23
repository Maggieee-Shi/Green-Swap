import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Package, Calendar, MapPin, ChevronRight } from "lucide-react";
import { Header } from "./Header";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface Order {
  id: string;
  items: Array<{
    product: {
      id: string;
      name: string;
      image: string;
      price: number;
    };
    quantity: number;
  }>;
  total: number;
  date: string;
  status: string;
  shippingAddress: {
    address: string;
    city: string;
    state?: string;
    zipCode: string;
  };
}

function getStatusBadgeClass(status: string) {
  switch (status.toLowerCase()) {
    case "delivered":
      return "bg-green-50 text-green-700 border-green-200";
    case "shipped":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "confirmed":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "cancelled":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
  }
}

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    // Sort newest first
    storedOrders.sort(
      (a: Order, b: Order) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setOrders(storedOrders);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">My Orders</h1>
        <p className="text-slate-500 mb-8">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="mx-auto h-16 w-16 text-slate-400 mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">No orders yet</h2>
              <p className="text-slate-600 mb-6">Start shopping to see your orders here</p>
              <Link to="/">
                <Button>Browse Products</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);
              const firstItem = order.items[0];

              return (
                <Link key={order.id} to={`/orders/${order.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                    <CardContent className="p-0">
                      <div className="flex items-stretch">
                        {/* Thumbnail strip */}
                        <div className="w-24 shrink-0 bg-slate-100 rounded-l-lg overflow-hidden">
                          {firstItem?.product.image ? (
                            <img
                              src={firstItem.product.image}
                              alt={firstItem.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-8 w-8 text-slate-400" />
                            </div>
                          )}
                        </div>

                        {/* Order info */}
                        <div className="flex-1 p-4 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                Order #{order.id}
                              </p>
                              <p className="font-semibold text-slate-900 mt-0.5 truncate">
                                {firstItem?.product.name}
                                {order.items.length > 1 && (
                                  <span className="text-slate-500 font-normal">
                                    {" "}+{order.items.length - 1} more
                                  </span>
                                )}
                              </p>
                              <p className="text-sm text-slate-500 mt-0.5">
                                {itemCount} item{itemCount !== 1 ? "s" : ""}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-lg font-bold text-slate-900">
                                ${order.total.toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-3 flex-wrap">
                              <div className="flex items-center gap-1 text-xs text-slate-500">
                                <Calendar className="h-3.5 w-3.5" />
                                {formatDate(order.date)}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-slate-500">
                                <MapPin className="h-3.5 w-3.5" />
                                {order.shippingAddress.city}
                                {order.shippingAddress.state
                                  ? `, ${order.shippingAddress.state}`
                                  : ""}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={`capitalize text-xs ${getStatusBadgeClass(order.status)}`}
                              >
                                {order.status}
                              </Badge>
                              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
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
      </div>
    </div>
  );
}
