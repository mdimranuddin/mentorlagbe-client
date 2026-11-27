"use client";

import { useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "@/lib/uploadImage";

export default function ImageUpload({ value, onChange, label = "Banner image", round }: {
  value: string; onChange: (url: string) => void; label?: string; round?: boolean;
}) {
  const [loading, setLoading] = useState(false);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please choose an image file"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be smaller than 5 MB"); return; }
    setLoading(true);
    try { onChange(await uploadImage(file)); toast.success("Image uploaded"); }
    catch { toast.error("Image upload failed. Try again."); }
    finally { setLoading(false); }
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm font-bold">{label}</span>
      <label className="flex cursor-pointer items-center gap-4 rounded-2xl bg-surface p-3 ring-1 ring-line hover:ring-brand">
        <span className={`grid h-20 w-28 shrink-0 place-items-center overflow-hidden bg-paper ${round ? "!h-20 !w-20 rounded-full" : "rounded-xl"}`}>
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Preview" className="h-full w-full object-cover" />
          ) : loading ? <Loader2 className="animate-spin text-muted" /> : <ImagePlus className="text-muted" />}
        </span>
        <span className="text-sm">
          <span className="block font-bold">{loading ? "Uploading..." : value ? "Change image" : "Upload an image"}</span>
          <span className="text-muted">PNG or JPG, up to 5 MB</span>
        </span>
        <input type="file" accept="image/*" onChange={onFile} className="sr-only" disabled={loading} />
      </label>
    </div>
  );
}
