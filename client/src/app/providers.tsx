"use client";
import { UserProvider } from "./context/UserProvider";
export default function Providers({ children }: { children: React.ReactNode }) {
  return <UserProvider>{children}</UserProvider>;
}
