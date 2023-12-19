import { Card } from "@/types/definitions";
import { auth } from "@/../auth";
import {
  getSetsByUserId,
  postSetData,
  setSetToDeleted,
} from "@/db/queries/sets";
import { postCardsData } from "@/db/queries/cards";

// profile page getting user's sets
export async function GET(request: Request) {
  const session = await auth();

  if (session) {
    const userId = session.user?.id;
    try {
      const data = await getSetsByUserId(userId);
      return Response.json(data, { status: 200 });
    } catch (err) {
      console.error(err);
      return Response.json({ message: "Error fetching sets" }, { status: 500 });
    }
  } else {
    return Response.json({ message: "Login to view profile" }, { status: 400 });
  }
}

// creating a set
export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user.id;

  const { setFormData, cardFormData } = await request.json();
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
  let setId = "";
  try {
    const set = await postSetData({ ...setFormData, user_id: userId });
    setId = set.id;
    // get the id returned from creating the set to create the cards
    const cardDataWithSetId = cardFormData.map((card: Card) => ({
      ...card,
      set_id: set.id,
    }));

    await postCardsData(cardDataWithSetId);

    return Response.json(
      {
        message: "Set created successfully",
      },
      { status: 201 }
    );
  } catch (err) {
    setId && (await setSetToDeleted(setId));
    console.error(err);
    return Response.json(err, { status: 500 });
  }
}
