import { getAllLanguages } from "@/db/queries/languages";
import { getSetInfoById } from "@/db/queries/sets";
import { getCardsBySetId } from "@/db/queries/cards";
import SetForm from "@/components/SetForm";
import { notFound } from "next/navigation";
import { auth } from "@/../auth";

const Page = async ({ params }: { params: { id: string } }) => {
  const setId = params.id;
  const languagesPromise = getAllLanguages();
  const setPromise = getSetInfoById(setId);
  const cardsPromise = getCardsBySetId(setId);
  const session = await auth();

  try {
    const [languages, setData, cardsData] = await Promise.all([
      languagesPromise,
      setPromise,
      cardsPromise,
    ]);

    // display when the user is not the set's owner
    if (!session || session.user.id !== setData?.set.user_id) {
      return (
        <main>
          <h1 className="text-xl text-center">
            Sorry, you don&apos;t have permission to edit this set!
          </h1>
        </main>
      );
    }

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
