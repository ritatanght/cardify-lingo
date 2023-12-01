"use client";
import { useSearchParams } from "next/navigation";
export default function Page() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  return <main>Search: {query}</main>;
}
