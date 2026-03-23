import { createBrowserRouter } from "react-router";
import { Marketplace } from "./components/Marketplace";
import { ProductDetail } from "./components/ProductDetail";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Cart } from "./components/Cart";
import { Checkout } from "./components/Checkout";
import { Orders } from "./components/Orders";
import { OrderDetail } from "./components/OrderDetail";
import { OrderConfirmation } from "./components/OrderConfirmation";
import { Admin } from "./components/Admin";
import { SellItem } from "./components/SellItem";
import { MyListings } from "./components/MyListings";
import { Conversations } from "./components/Conversations";
import { Chat } from "./components/Chat";
import { ProfilePage } from "./components/ProfilePage";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Marketplace,
  },
  {
    path: "/product/:id",
    Component: ProductDetail,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/cart",
    Component: Cart,
  },
  {
    path: "/checkout",
    element: (
      <ProtectedRoute>
        <Checkout />
      </ProtectedRoute>
    ),
  },
  {
    path: "/orders",
    element: (
      <ProtectedRoute>
        <Orders />
      </ProtectedRoute>
    ),
  },
  {
    path: "/orders/:orderId",
    element: (
      <ProtectedRoute>
        <OrderDetail />
      </ProtectedRoute>
    ),
  },
  {
    path: "/order-confirmation/:orderId",
    element: (
      <ProtectedRoute>
        <OrderConfirmation />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/sell",
    element: (
      <ProtectedRoute>
        <SellItem />
      </ProtectedRoute>
    ),
  },
  {
    path: "/my-listings",
    element: (
      <ProtectedRoute>
        <MyListings />
      </ProtectedRoute>
    ),
  },
  {
    path: "/conversations",
    element: (
      <ProtectedRoute>
        <Conversations />
      </ProtectedRoute>
    ),
  },
  {
    path: "/conversations/:id",
    element: (
      <ProtectedRoute>
        <Chat />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute requireAdmin>
        <Admin />
      </ProtectedRoute>
    ),
  },
]);
