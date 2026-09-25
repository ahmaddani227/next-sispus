import type { Metadata } from "next";
import { Login } from "@/features/auth/components/Login";

export const metadata: Metadata = {
  title: "Login Petugas - SIPUS Ar-Rasyid",
  description:
    "Portal masuk khusus staf dan administrator perpustakaan madrasah MI & MTs Ar-Rasyid.",
};

export default function LoginPage() {
  return <Login />;
}
