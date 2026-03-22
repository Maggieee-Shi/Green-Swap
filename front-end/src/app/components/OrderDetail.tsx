import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Package, Calendar, MapPin, CheckCircle, Clock, Truck, XCircle } from "lucide-react";
import { Header } from "./Header";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

interface OrderItem {
  product: {
    id: string;
    name: string;
    image: string;
    price: number;
  };
  quantity: number;
}

interface Order {
  id: string;
  items: OrderItem[];
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

const STATUS_STEPS = ["pending", "confirmed", "shipped", "delivered"];

function StatusTimeline({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const currentIndex = STATUS_STEPS.indexOf(normalized);
  const isCancelled = normalized === "cancelled";

  const icons = {
    pending: Clock,
    confirmed: CheckCircle,
    shipped: Truck,
    delivered: Package,
  };

  const labels = {
    pending: "Order Placed",
    confirmed: "Confirmed",
    shipped: "Shipped",
    delivered: "Delivered",
  };

  if (isCancelled) {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
        <XCircle className="h-6 w-6 text-red-500" />
        <div>
          <p className="font-semibold text-red-700">Order Cancelled</p>
          <p className="text-sm text-red-600">This order has been cancelled.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-0">
      {STATUS_STEPS.map((step, index) => {
        const Icon = icons[step as keyof typeof icons];
        const isCompleted = index <= currentIndex;
        const isActive = index === currentIndex;

        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isActive
                    ? "bg-green-600 text-white shadow-md"
                    : isCompleted
                    ? "bg-green-100 text-green-600"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span
                className={`text-xs mt-1 font-medium whitespace-nowrap ${
                  isCompleted ? "text-green-700" : "text-slate-400"
                }`}
              >
                {labels[step as keyof typeof labels]}
              </span>
            </div>
            {index < STATUS_STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 mb-4 ${
                  index < currentIndex ? "bg-green-400" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
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

export function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const storedOrders: Order[] = JSON.parse(localStorage.getItem("orders") || "[]");
    const found = storedOrders.find((o) => o.id === orderId);
    setOrder(found ?? null);
  }, [orderId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <Package className="mx-auto h-16 w-16 text-slate-400 mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Order not found</h2>
          <p className="text-slate-600 mb-6">We couldn't find order #{orderId}</p>
          <Link to="/orders">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const tax = order.total - subtotal > 0 ? order.total - subtotal : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back + Title */}
        <div className="mb-6">
          <Link to="/orders" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-4">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Orders
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Order #{order.id}</h1>
              <div className="flex items-center gap-3 mt-1 text-sm text-slate-600">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(order.date)}</span>
              </div>
            </div>
            <Badge
              variant="outline"
              className={`capitalize text-sm px-3 py-1 ${getStatusBadgeClass(order.status)}`}
            >
              {order.status}
            </Badge>
          </div>
        </div>

        {/* Status Timeline */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Order Status</CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <StatusTimeline status={order.status} />
          </CardContent>
        </Card>

        {/* Items */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">
              Items ({order.items.reduce((sum, i) => sum + i.quantity, 0)})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index}>
                {index > 0 && <Separator className="mb-4" />}
                <div className="flex gap-4">
                  <Link to={`/product/${item.product.id}`}>
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg border hover:opacity-90 transition-opacity"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.product.id}`}>
                      <h3 className="font-semibold text-slate-900 hover:text-green-700 transition-colors">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Qty: {item.quantity} × ${item.product.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-slate-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-700 space-y-0.5">
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}
                {order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ""}
                {" "}{order.shippingAddress.zipCode}
              </p>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {tax > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Tax & fees</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-slate-900 text-base">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
