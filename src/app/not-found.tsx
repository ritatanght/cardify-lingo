import Link from "next/link";
import Image from "next/image";
export default function NotFound() {
  return (
    <main className="text-center">
      <Image
        src="/404err.png"
        height={350}
        width={350}
        alt="404 Page Not Found"
        className="mx-auto"
      />
      <Link className="btn py-3" href="/">
        Return Home
      </Link>
    </main>
  );
}
