import { getAllLanguages } from "@/../db/queries/languages";
import { getSetInfoById } from "@/../db/queries/sets";
import { getCardsBySetId } from "@/../db/queries/cards";
import SetForm from "@/app/ui/components/SetForm";
import { notFound } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {
  const setId = params.id;
  const languagesPromise = getAllLanguages();
  const setPromise = getSetInfoById(setId);
  const cardsPromise = getCardsBySetId(setId);

  try {
    const [languages, setData, cardsData] = await Promise.all([
      languagesPromise,
      setPromise,
      cardsPromise,
    ]);

    return (
      <SetForm
        mode="edit"
        languages={languages}
        setData={{ set: setData, cards: cardsData }}
      />
    );
  } catch (err: any) {
    notFound();
  }
};

export default Page;
