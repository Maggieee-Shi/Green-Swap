import { useEffect, useState } from "react";
import { Link } from "react-router";
import { MessageCircle, Package } from "lucide-react";
import { Header } from "./Header";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { apiFetch } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

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

export function Conversations() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<Conversation[]>("/conversations")
      .then(setConversations)
      .catch(() => toast.error("Failed to load messages"))
      .finally(() => setLoading(false));
  }, []);

  const formatTime = (dt: string | null) => {
    if (!dt) return "";
    const date = new Date(dt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
    if (diffDays === 0) return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return date.toLocaleDateString("en-US", { weekday: "short" });
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Messages</h1>
        <p className="text-slate-500 mb-8">{conversations.length} conversation{conversations.length !== 1 ? "s" : ""}</p>

        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading…</div>
        ) : conversations.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageCircle className="mx-auto h-16 w-16 text-slate-400 mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">No messages yet</h2>
              <p className="text-slate-600 mb-6">Your conversations with buyers and sellers will appear here</p>
              <Link to="/">
                <Button>Browse Marketplace</Button>
              </Link>
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
                    <CardContent className="p-0">
                      <div className="flex items-center gap-3 p-4">
                        <div className="w-12 h-12 shrink-0 bg-slate-100 rounded-lg overflow-hidden">
                          {conv.productImageUrl ? (
                            <img
                              src={conv.productImageUrl}
                              alt={conv.productName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-5 w-5 text-slate-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-slate-900 truncate">{otherName}</p>
                            <p className="text-xs text-slate-400 shrink-0 ml-2">
                              {formatTime(conv.lastMessageAt)}
                            </p>
                          </div>
                          <p className="text-sm text-slate-500 truncate">{conv.productName}</p>
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
