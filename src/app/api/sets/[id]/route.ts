import {
  getSetInfoById,
  getSetOwnerBySetId,
  setSetToDeleted,
  updateSetData,
} from "@/db/queries/sets";
import { getCardsBySetId, setCardsToDeleted, updateCardsData } from "@/db/queries/cards";
import { Card } from "@/types/definitions";
import { auth } from "@/../auth";
import { revalidatePath } from "next/cache";

// Get the sets and cards for ViewSets and EditSet
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const setId = params.id;
  const setPromise = getSetInfoById(setId);
  const cardsPromise = getCardsBySetId(setId);
  try {
    const [setData, cardsData] = await Promise.all([setPromise, cardsPromise]);
    if (!setData)
      return Response.json({ message: "Set not found" }, { status: 404 });
    return Response.json({ set: setData, cards: cardsData });
  } catch (err) {
    console.error(err);
  }
}

// Update a set on Edit Page
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const setId = params.id;

  // make sure the user is logged-in
  if (!session)
    return Response.json({ message: "Please log in first." }, { status: 401 });

  const { setFormData, cardFormData } = await request.json();
  const { title, description, language_id } = setFormData;

  if (!title || !description)
    return Response.json(
      { message: "Title and description cannot be empty" },
      { status: 400 }
    );

  if (!language_id)
    return Response.json(
      { message: "Please pick a language" },
      { status: 400 }
    );

  if (cardFormData.length === 0)
    return Response.json(
      { message: "There should be at least one card" },
      { status: 400 }
    );

  const emptyCard = cardFormData.some(
    (card: Card) => !card.front || !card.back
  );
  if (emptyCard)
    return Response.json({ message: "Cards cannot be empty" }, { status: 400 });
  try {
    const userId = session.user.id;
    // make sure the user who edits the set is the set owner
    const data = await getSetOwnerBySetId(setId);
    if (!data)
      return Response.json({ message: "Set not found." }, { status: 404 });
    if (data.user_id !== userId)
      return Response.json(
        {
          message: "You can only edit your own set.",
        },
        { status: 403 }
      );

    // update the set and cards
    const updateSetPromise = updateSetData({ ...setFormData });
    const updateCardsPromise = updateCardsData(
      cardFormData.map((card: Card, index: number) => {
        // add the sequence key to the array of cards
        if (card.id) {
          if (card.deleted) {
            // set the sequence to 0 for a deleted card
            return { ...card, sequence: 0 };
          } else {
            // set the sequence normally for an existing card
            return { ...card, sequence: index + 1 };
          }
        } else {
          // add set_id key and set the sequence to new cards
          return { ...card, set_id: setId, sequence: index + 1 };
        }
      })
    );

    await Promise.all([updateSetPromise, updateCardsPromise]);
    revalidatePath("/profile", "page");
    revalidatePath("/languages/[id]", "page");
    revalidatePath(`/sets/${setId}`);

    return Response.json(
      { message: "Set updated successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return Response.json(err, { status: 500 });
  }
}

// owner deleting a set
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const setId = params.id;

  // make sure the user is logged-in
  if (!session)
    return Response.json({ message: "Please log in first." }, { status: 401 });
  const userId = session?.user.id;

  try {
    // make sure the user who deletes the set is the set owner
    const data = await getSetOwnerBySetId(setId);
    if (!data)
      return Response.json({ message: "Set not found." }, { status: 404 });
    if (data.user_id !== userId)
      return Response.json(
        {
          message: "You can only delete your own set.",
        },
        { status: 403 }
      );

    // mark the set and the cards under the set as deleted in the database
    await setSetToDeleted(setId);
    await setCardsToDeleted(setId);

    return Response.json({ message: "Set deleted" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json(err, { status: 500 });
  }
}
