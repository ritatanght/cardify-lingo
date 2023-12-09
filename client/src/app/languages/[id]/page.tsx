import { getLanguageById } from "@/app/lib/api";
import { Language, Set } from "@/app/lib/definitions";
import { AxiosError, isAxiosError } from "axios";
import { notFound } from "next/navigation";
import SetList from "@/app/ui/components/SetList";

type languageData = {
  language: Language["name"];
  sets: Set[];
};

export default async function Page({ params }: { params: { id: string } }) {
  const languageId = params.id;
  try {
    const { language, sets } = await getLanguageById(languageId);

    return (
      <main>
        <h1 className="text-3xl md:text-4xl mb-7">
          Language: <span className="text-color-5">{language}</span>
        </h1>
        <SetList from="language" setsData={sets} />
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
