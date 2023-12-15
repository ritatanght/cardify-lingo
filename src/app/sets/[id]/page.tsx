import { getSetInfoById } from "@/db/queries/sets";
import { getCardsBySetId } from "@/db/queries/cards";
import SetContainer from "./_components/SetContainer";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const setId = params.id;
  const setPromise = getSetInfoById(setId);
  const cardsPromise = getCardsBySetId(setId);

  try {
    const [setData, cardsData] = await Promise.all([setPromise, cardsPromise]);

    return <SetContainer fullSetData={{ set: setData, cards: cardsData }} />;
  } catch (err: any) {
    notFound();
  }
}
