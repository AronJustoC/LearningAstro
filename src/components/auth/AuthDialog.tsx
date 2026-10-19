import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthDialog() {
  const [tab, setTab] = useState("login");

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" className="min-h-10 px-4 hover:-translate-y-px shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-lift)] transition-all duration-200 active:translate-y-0" />}>
        Ingresar
      </DialogTrigger>
      <DialogContent className="sm:max-w-md shadow-[var(--shadow-lift)] border-border">
        <DialogHeader>
          <DialogTitle className="text-xl text-center font-semibold text-foreground">
            {tab === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
          </DialogTitle>
        </DialogHeader>
        <Tabs value={tab} onValueChange={(value) => setTab(value as string)}>
          <TabsList className="w-full h-11 p-1 bg-muted/60">
            <TabsTrigger value="login" className="flex-1 min-h-9 transition-all duration-200">
              Ingresar
            </TabsTrigger>
            <TabsTrigger value="register" className="flex-1 min-h-9 transition-all duration-200">
              Registrarme
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="pt-4">
            <LoginForm />
          </TabsContent>
          <TabsContent value="register" className="pt-4">
            <RegisterForm />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
