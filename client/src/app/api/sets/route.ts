import { Card, Set } from "@/app/lib/definitions";
import { auth } from "../../../../auth";
const sets = require("@/../db/queries/sets");
const cards = require("@/../db/queries/cards");

export async function POST(request: Request) {
  const session = await auth();
  const { setFormData, cardFormData, userId } = await request.json();
  const { title, description, language_id } = setFormData;

  if (!session || !userId)
    return Response.json({ message: "Please log in first." }, { status: 401 });

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
    (card: Partial<Card>) => !card.front || !card.back
  );
  if (emptyCard)
    return Response.json({ message: "Cards cannot be empty" }, { status: 400 });

  try {
    const set = await sets.postSetData({ ...setFormData, user_id: userId });
    const setId = set.id;
    // get the id returned from creating the set to create the cards
    const cardDataWithSetId = cardFormData.map((card: Card) => ({
      ...card,
      setId,
    }));

    await cards.postCardsData(cardDataWithSetId);

    return Response.json(
      {
        message: "Set created successfully",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return Response.json(err, { status: 500 });
  }
}
