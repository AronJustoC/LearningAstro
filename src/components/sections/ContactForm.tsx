import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { CONTACT_EMAIL } from "@/lib/contact";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage("Preparando tu correo...");

    const subject = encodeURIComponent(`Contacto desde el portfolio - ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setStatusMessage(`Si no se abrió tu cliente de correo, escribe a ${CONTACT_EMAIL}.`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="name" className="label">Nombre</Label>
        <Input
          className="h-11 rounded-[2px] text-base"
          id="name"
          autoComplete="name"
          placeholder="Ej.: María Torres"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email" className="label">Correo electrónico</Label>
        <Input
          className="h-11 rounded-[2px] text-base"
          id="email"
          autoComplete="email"
          placeholder="maria@empresa.com"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="message" className="label">¿Qué necesitas resolver?</Label>
        <Textarea
          className="rounded-[2px] text-base"
          id="message"
          rows={5}
          placeholder="Ej.: automatizar aprobaciones y reportes internos"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <Button type="submit" className="btn-block w-full h-auto min-h-12 rounded-[2px]">
        Abrir en mi correo
      </Button>

      <div aria-live="polite" className="text-xs text-center text-muted-foreground min-h-[1rem]">
        {statusMessage}
      </div>
    </form>
  );
}
