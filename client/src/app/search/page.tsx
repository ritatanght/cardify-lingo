import { searchSets } from "@/app/lib/api";import Loading from "../loading";
import { Suspense } from "react";
import SearchList from "./SearchList";

export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const query: string | undefined = searchParams?.query;
  const sets = query && (await searchSets(query));

  return (
    <main className="search-container">
      <h1 className="text-3xl md:text-4xl mb-7">
        Search Results for &quot;<span className="text-color-5">{query}</span>
        &quot;
      </h1>
      <Suspense fallback={<Loading />}>
        <SearchList searchSets={sets} />
      </Suspense>
    </main>
  );
}
