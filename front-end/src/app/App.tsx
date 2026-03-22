import { RouterProvider } from "react-router";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { InventoryProvider } from "./contexts/InventoryContext";
import { router } from "./routes";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <InventoryProvider>
          <RouterProvider router={router} />
          <Toaster />
        </InventoryProvider>
      </CartProvider>
    </AuthProvider>
  );
}
