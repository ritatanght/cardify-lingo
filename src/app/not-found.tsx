import Link from "next/link";
import { playpen } from "./ui/fonts";
export default function NotFound() {
  return (
    <main className="text-center">
      <h2 className={`text-2xl my-6 ${playpen.className}`}>
        404 Page Not Found
      </h2>
      <Link className="btn" href="/">
        Return Home
      </Link>
    </main>
  );
}
