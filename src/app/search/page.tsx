import { searchByText } from "@/../db/queries/searches";
import SetList from "../ui/components/SetList";
import Loading from "../loading";
import { Suspense } from "react";
import { notFound } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const query: string | undefined = searchParams?.query;

  try {
    const sets = query && (await searchByText(query));

    return (
      <main className="search-container">
        <h1 className="text-3xl md:text-4xl mb-7">
          Search Results for &quot;<span className="text-color-5">{query}</span>
          &quot;
        </h1>
        <Suspense fallback={<Loading />}>
          {sets && sets.length > 0 ? (
            <SetList setsData={sets} />
          ) : (
            <h2>~ No set found matching your query ~</h2>
          )}
        </Suspense>
      </main>
    );
  } catch (err: any) {
    notFound();
  }
}
