import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const API_URL = `${import.meta.env.PUBLIC_API_BASE_URL}/uploads/signature`;

function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return {
    Authorization: `Bearer ${token}`,
  };
}

type SignatureResponse = {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  signature: string;
};

type Props = {
  value: string;
  onChange: (url: string) => void;
  label: string;
};

export default function ImageUploadField({ value, onChange, label }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setLoading(true);
    try {
      const signatureResponse = await fetch(API_URL, {
        method: "POST",
        headers: authHeaders(),
      });
      if (!signatureResponse.ok) {
        setError("No se pudo obtener la firma de subida.");
        return;
      }
      const { cloudName, apiKey, timestamp, folder, signature } =
        (await signatureResponse.json()) as SignatureResponse;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", String(timestamp));
      formData.append("signature", signature);
      formData.append("folder", folder);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );
      if (!uploadResponse.ok) {
        setError("No se pudo subir la imagen.");
        return;
      }
      const uploadData = await uploadResponse.json();
      onChange(uploadData.secure_url);
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="space-y-1.5">
      <Label htmlFor="imageUrl">{label}</Label>
      <Input
        id="imageUrl"
        type="url"
        disabled={loading}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://..."
        className="min-h-10 transition-colors focus-visible:ring-2 focus-visible:ring-ring"
      />
      <Input
        id="imageFile"
        type="file"
        accept="image/*"
        disabled={loading}
        onChange={handleFile}
        className="min-h-10 cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-ring file:mr-3 file:rounded-md file:border-0 file:bg-[var(--color-action)] file:px-3 file:py-1.5 file:text-[var(--color-on-action)]"
      />
      {loading && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Subiendo imagen...
        </p>
      )}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
