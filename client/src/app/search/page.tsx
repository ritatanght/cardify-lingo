import { searchSets } from "@/app/lib/api";
import SetList from "../ui/components/SetList";
import Loading from "../loading";
import { Suspense } from "react";
import { AxiosError, isAxiosError } from "axios";
import { notFound } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const query: string | undefined = searchParams?.query;

  try {
    const sets = query && (await searchSets(query));

    return (
      <main className="search-container">
        <h1 className="text-3xl md:text-4xl mb-7">
          Search Results for &quot;<span className="text-color-5">{query}</span>
          &quot;
        </h1>
        <Suspense fallback={<Loading />}>
          <SetList from="search" setsData={sets} />
        </Suspense>
      </main>
    );
  } catch (err: any | AxiosError) {
    if (isAxiosError(err) && err.response?.status === 404) {
      notFound();
    } else {
      console.log(err);
    }
  }
}
