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
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        Ingresar
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">
            {tab === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
          </DialogTitle>
        </DialogHeader>
        <Tabs value={tab} onValueChange={(value) => setTab(value as string)}>
          <TabsList className="w-full">
            <TabsTrigger value="login" className="flex-1">
              Ingresar
            </TabsTrigger>
            <TabsTrigger value="register" className="flex-1">
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
