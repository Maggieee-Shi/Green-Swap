import { useParams, Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import {
  ArrowLeft, MapPin, User, Calendar, MessageCircle, Heart,
  ShoppingCart, Minus, Plus, DollarSign, Send,
} from "lucide-react";
import { Product, displayCondition, displayCategory, conditionColor } from "../types/product";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import { Header } from "./Header";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { apiFetch } from "../lib/api";

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useAuth ? (() => ({ addToCart: null }))() : { addToCart: null };
  const cart = useCart();
  const { isAuthenticated, user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Contact Seller dialog
  const [contactOpen, setContactOpen] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [contactSending, setContactSending] = useState(false);

  // Make an Offer dialog
  const [offerOpen, setOfferOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [offerSending, setOfferSending] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/products/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleContactSend = async () => {
    if (!contactMessage.trim() || !product) return;
    setContactSending(true);
    try {
      const conv = await apiFetch<{ id: string }>("/conversations", {
        method: "POST",
        body: JSON.stringify({ productId: Number(product.id), message: contactMessage.trim() }),
      });
      setContactOpen(false);
      setContactMessage("");
      navigate(`/conversations/${conv.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setContactSending(false);
    }
  };

  const handleOfferSend = async () => {
    const amount = parseFloat(offerAmount);
    if (!offerAmount || isNaN(amount) || amount <= 0) return;
    setOfferSending(true);
    // Offers just start a conversation with the offer details
    try {
      const offerText = `I'd like to offer $${amount.toFixed(2)} for this item.${offerMessage ? "\n\n" + offerMessage : ""}`;
      const conv = await apiFetch<{ id: string }>("/conversations", {
        method: "POST",
        body: JSON.stringify({ productId: Number(product!.id), message: offerText }),
      });
      setOfferOpen(false);
      setOfferAmount("");
      setOfferMessage("");
      navigate(`/conversations/${conv.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send offer");
    } finally {
      setOfferSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">Loading…</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Product not found</h2>
          <Link to="/">
            <Button><ArrowLeft className="mr-2 h-4 w-4" />Back to Marketplace</Button>
          </Link>
        </div>
      </div>
    );
  }

  const price = typeof product.price === "number" ? product.price : parseFloat(String(product.price));
  const isMine = user?.id === product.sellerId;

  // Adapt product for addToCart (expects old shape)
  const cartProduct = {
    id: product.id,
    name: product.name,
    price,
    image: product.imageUrl || "",
    inventory: product.inventory,
    condition: displayCondition(product.condition),
    category: displayCategory(product.category),
    brand: product.brand || "",
    description: product.description || "",
    location: product.location || "",
    seller: product.sellerName || "",
    listedDate: product.createdAt || "",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-6">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Marketplace
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div>
            <Card className="overflow-hidden">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-full aspect-square object-cover" />
              ) : (
                <div className="w-full aspect-square flex items-center justify-center bg-slate-100 text-6xl">⛳</div>
              )}
            </Card>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-slate-900">{product.name}</h1>
                <Button variant="ghost" size="icon"><Heart className="h-5 w-5" /></Button>
              </div>
              {product.brand && <p className="text-xl text-slate-600">{product.brand}</p>}
            </div>

            <div className="flex items-center gap-3">
              <Badge className={conditionColor(product.condition)} variant="outline">
                {displayCondition(product.condition)}
              </Badge>
              <Badge variant="outline">{displayCategory(product.category)}</Badge>
              {product.sold && (
                <Badge className="bg-slate-100 text-slate-600 border-slate-200" variant="outline">Sold</Badge>
              )}
            </div>

            <p className="text-4xl font-bold text-slate-900">${price.toFixed(2)}</p>

            <Separator />

            {product.description && (
              <>
                <div>
                  <h2 className="font-semibold text-slate-900 mb-2">Description</h2>
                  <p className="text-slate-700 leading-relaxed">{product.description}</p>
                </div>
                <Separator />
              </>
            )}

            {/* Add to Cart */}
            {!product.sold && product.inventory > 0 && !isMine && (
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-700">Quantity:</span>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <Button variant="outline" size="icon" className="h-8 w-8"
                        onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))}
                        disabled={quantity >= product.inventory}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button className="w-full" size="lg"
                    onClick={() => { cart.addToCart(cartProduct as any, quantity); setQuantity(1); }}>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            )}

            <Separator />

            {/* Seller Info */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold text-slate-900">Seller Information</h3>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <User className="h-4 w-4" />
                  <span>{product.sellerName || "Unknown seller"}</span>
                </div>
                {product.location && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="h-4 w-4" />
                    <span>{product.location}</span>
                  </div>
                )}
                {product.createdAt && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="h-4 w-4" />
                    <span>Listed {new Date(product.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons — only show if not your own listing and not sold */}
            {!isMine && !product.sold && (
              <div className="space-y-3">
                <Button className="w-full" size="lg"
                  onClick={() => {
                    if (!isAuthenticated) { toast.error("Please sign in to contact the seller"); return; }
                    setContactOpen(true);
                  }}>
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Contact Seller
                </Button>
                <Button variant="outline" className="w-full" size="lg"
                  onClick={() => {
                    if (!isAuthenticated) { toast.error("Please sign in to make an offer"); return; }
                    setOfferOpen(true);
                  }}>
                  <DollarSign className="mr-2 h-5 w-5" />
                  Make an Offer
                </Button>
              </div>
            )}

            {/* Contact Seller Dialog */}
            <Dialog open={contactOpen} onOpenChange={setContactOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                    Contact {product.sellerName}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                    <p className="font-medium text-slate-800">{product.name}</p>
                    <p className="text-slate-500">${price.toFixed(2)} · {displayCondition(product.condition)}</p>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-msg">Your message</Label>
                    <Textarea id="contact-msg" rows={4}
                      placeholder={`Hi ${product.sellerName}, I'm interested in your ${product.name}. Is it still available?`}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setContactOpen(false)}>Cancel</Button>
                  <Button onClick={handleContactSend} disabled={!contactMessage.trim() || contactSending}>
                    <Send className="mr-2 h-4 w-4" />
                    {contactSending ? "Sending…" : "Send Message"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Make an Offer Dialog */}
            <Dialog open={offerOpen} onOpenChange={setOfferOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Make an Offer
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                    <p className="font-medium text-slate-800">{product.name}</p>
                    <p className="text-slate-500">Listed at <span className="font-semibold text-slate-700">${price.toFixed(2)}</span></p>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="offer-amount">Your offer (USD)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                      <Input id="offer-amount" type="number" min="1" step="0.01"
                        placeholder={String(Math.round(price * 0.9))}
                        className="pl-7" value={offerAmount}
                        onChange={(e) => setOfferAmount(e.target.value)} />
                    </div>
                    {offerAmount && !isNaN(parseFloat(offerAmount)) && (
                      <p className="text-xs text-slate-500">
                        {parseFloat(offerAmount) < price
                          ? `${Math.round((1 - parseFloat(offerAmount) / price) * 100)}% below asking price`
                          : parseFloat(offerAmount) === price ? "Equal to asking price" : "Above asking price"}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="offer-msg">Message <span className="text-slate-400">(optional)</span></Label>
                    <Textarea id="offer-msg" rows={3} placeholder="Add a note to accompany your offer…"
                      value={offerMessage} onChange={(e) => setOfferMessage(e.target.value)} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOfferOpen(false)}>Cancel</Button>
                  <Button onClick={handleOfferSend}
                    disabled={!offerAmount || isNaN(parseFloat(offerAmount)) || parseFloat(offerAmount) <= 0 || offerSending}>
                    <Send className="mr-2 h-4 w-4" />
                    {offerSending ? "Sending…" : "Send Offer"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <p className="text-sm text-blue-900">
                  <strong>Safety tip:</strong> Meet in a public place, inspect items before purchasing, and never send money in advance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Similar Items */}
        <SimilarItems productId={product.id} category={product.category} />
      </div>
    </div>
  );
}

function SimilarItems({ productId, category }: { productId: string; category: string }) {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    fetch(`/api/products?category=${category}`)
      .then((r) => r.json())
      .then((data: Product[]) => setItems(data.filter((p) => p.id !== productId).slice(0, 4)))
      .catch(() => {});
  }, [productId, category]);

  if (items.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Similar Items</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((p) => (
          <Link key={p.id} to={`/product/${p.id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="aspect-square overflow-hidden bg-slate-100">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">⛳</div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-slate-900 line-clamp-2 mb-1">{p.name}</h3>
                <p className="text-xl font-bold text-slate-900">
                  ${typeof p.price === "number" ? p.price.toFixed(2) : p.price}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
