import { Link } from "react-router";
import { ShoppingCart, User, Tag } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export function Header() {
  const { isAuthenticated } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-slate-900">⛳ GreenSwap</h1>
          </Link>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <Link to="/sell">
                <Button size="sm" className="hidden sm:flex">
                  <Tag className="mr-1.5 h-4 w-4" />
                  Sell
                </Button>
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User icon → profile page or sign in */}
            {isAuthenticated ? (
              <Link to="/profile">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
