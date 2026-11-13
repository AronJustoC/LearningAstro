// Reescribe URLs de entrega de Cloudinary para servir formato y calidad automáticos
// (WebP/AVIF) y un ancho máximo. Otras URLs se devuelven sin cambios.
export function optimizedImage(url: string | null | undefined, width = 800): string | undefined {
  if (!url) return undefined;
  return url.replace(
    /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/,
    `$1f_auto,q_auto,w_${width}/$2`,
  );
}
