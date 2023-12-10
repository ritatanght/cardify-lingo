const sets = require("@/../db/queries/sets");
const cards = require("@/../db/queries/cards");
import { Card } from "@/app/types/definitions";
import { auth } from "../../../../../auth";
// Get the sets and cards for ViewSets and EditSet
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const setId = params.id;
  const setPromise = sets.getSetInfoById(setId);
  const cardsPromise = cards.getCardsBySetId(setId);
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

  const { setFormData, cardFormData, userId } = await request.json();
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
    // make sure the user who edits the set is the set owner
    const data = await sets.getSetOwnerBySetId(setId);
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
    const updateSetPromise = sets.updateSetData({ ...setFormData });
    const updateCardsPromise = cards.updateCardsData(
      cardFormData.map((card: Card) =>
        card.id ? card : { ...card, set_id: setId }
      ) // add set_id key to new cards
    );

    await Promise.all([updateSetPromise, updateCardsPromise]);
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
  const { userId } = await request.json();

  // make sure the user is logged-in
  if (!session)
    return Response.json({ message: "Please log in first." }, { status: 401 });

  try {
    // make sure the user who deletes the set is the set owner
    const data = await sets.getSetOwnerBySetId(setId);
    if (!data)
      return Response.json({ message: "Set not found." }, { status: 404 });
    if (data.user_id !== userId)
      return Response.json(
        {
          message: "You can only delete your own set.",
        },
        { status: 403 }
      );

    // set the set as deleted in the database
    await sets.setSetToDeleted(setId);

    return Response.json({ message: "Set deleted" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json(err, { status: 500 });
  }
}
