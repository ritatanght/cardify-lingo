import { getLanguageById } from "@/db/queries/languages";
import { getSetsByLanguageId } from "@/db/queries/sets";
import { notFound } from "next/navigation";
import SetList from "@/components/SetList";

export default async function Page({ params }: { params: { id: string } }) {
  const languageId = params.id;
  const languagePromise = getLanguageById(languageId);
  const setsPromise = getSetsByLanguageId(languageId);
  try {
    const [language, sets] = await Promise.all([languagePromise, setsPromise]);

    return (
      <main>
        <h1 className="text-3xl md:text-4xl mb-7">
          Language: <span className="text-color-5">{language.name}</span>
        </h1>
        {sets && sets.length > 0 ? (
          <SetList setsData={sets} />
        ) : (
          <h2>There are currently no sets in this language.</h2>
        )}
      </main>
    );
  } catch (err: any) {
    notFound();
  }
}
