import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { CheckCircle, Package } from "lucide-react";
import { Header } from "./Header";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

export function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const foundOrder = orders.find((o: any) => o.id === orderId);
    setOrder(foundOrder);
  }, [orderId]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="mx-auto h-20 w-20 text-green-600 mb-6" />
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Order Confirmed!</h1>
            <p className="text-lg text-slate-600 mb-6">
              Thank you for your purchase. Your order has been successfully placed.
            </p>

            {order && (
              <div className="bg-slate-50 rounded-lg p-6 mb-6 text-left">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="h-5 w-5 text-slate-600" />
                  <h2 className="font-semibold text-slate-900">Order Details</h2>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Order ID:</span>
                    <span className="font-medium text-slate-900">{order.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total:</span>
                    <span className="font-medium text-slate-900">${order.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Items:</span>
                    <span className="font-medium text-slate-900">
                      {order.items.reduce((sum: number, item: any) => sum + item.quantity, 0)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Link to="/orders" className="block">
                <Button className="w-full" size="lg">
                  View My Orders
                </Button>
              </Link>
              <Link to="/" className="block">
                <Button variant="outline" className="w-full" size="lg">
                  Continue Shopping
                </Button>
              </Link>
            </div>

            <p className="text-sm text-slate-500 mt-6">
              A confirmation email has been sent to your registered email address.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
