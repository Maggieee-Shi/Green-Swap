import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Upload, X } from "lucide-react";
import { Header } from "./Header";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";
import { apiFetch, apiUpload } from "../lib/api";

const CATEGORIES = ["DRIVERS", "IRONS", "PUTTERS", "WEDGES", "HYBRIDS", "BAGS", "SHOES", "BALLS"];
const CONDITIONS = ["EXCELLENT", "VERY_GOOD", "GOOD", "FAIR"];
const CONDITION_LABELS: Record<string, string> = {
  EXCELLENT: "Excellent",
  VERY_GOOD: "Very Good",
  GOOD: "Good",
  FAIR: "Fair",
};

export function SellItem() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    inventory: "1",
    category: "",
    condition: "",
    location: "",
  });

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10 MB");
      return;
    }
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category || !form.condition) {
      toast.error("Please fill in all required fields");
      return;
    }
    const price = parseFloat(form.price);
    if (isNaN(price) || price <= 0) {
      toast.error("Enter a valid price");
      return;
    }
    setSubmitting(true);
    try {
      let imageUrl: string | null = null;
      if (selectedFile) {
        imageUrl = await apiUpload(selectedFile);
      }
      await apiFetch("/products", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          brand: form.brand || null,
          description: form.description || null,
          price,
          inventory: parseInt(form.inventory) || 1,
          category: form.category,
          condition: form.condition,
          location: form.location || null,
          imageUrl,
        }),
      });
      toast.success("Listing created!");
      navigate("/profile");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to create listing");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">List an Item for Sale</h1>
        <Card>
          <CardHeader>
            <CardTitle>Item Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Image Upload */}
              <div className="space-y-1.5">
                <Label>Photo</Label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative cursor-pointer rounded-lg border-2 border-dashed border-slate-200 hover:border-slate-300 transition-colors overflow-hidden bg-slate-50"
                  style={{ aspectRatio: "16/9" }}
                >
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-slate-100"
                      >
                        <X className="h-4 w-4 text-slate-600" />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                      <Upload className="h-8 w-8" />
                      <p className="text-sm font-medium">Click to upload a photo</p>
                      <p className="text-xs">JPG, PNG, WEBP up to 10 MB</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="name">Title <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  placeholder="e.g. TaylorMade SIM2 Driver"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    placeholder="e.g. TaylorMade"
                    value={form.brand}
                    onChange={(e) => set("brand", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g. San Diego, CA"
                    value={form.location}
                    onChange={(e) => set("location", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  placeholder="Describe the item, any accessories included, how it plays, etc."
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="price">Price (USD) <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <Input
                      id="price"
                      type="number"
                      min="1"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-7"
                      value={form.price}
                      onChange={(e) => set("price", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="inventory">Quantity</Label>
                  <Input
                    id="inventory"
                    type="number"
                    min="1"
                    value={form.inventory}
                    onChange={(e) => set("inventory", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Category <span className="text-red-500">*</span></Label>
                  <Select value={form.category} onValueChange={(v) => set("category", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c.charAt(0) + c.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Condition <span className="text-red-500">*</span></Label>
                  <Select value={form.condition} onValueChange={(v) => set("condition", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONDITIONS.map((c) => (
                        <SelectItem key={c} value={c}>
                          {CONDITION_LABELS[c]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                {submitting ? "Creating listing…" : "List Item for Sale"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
