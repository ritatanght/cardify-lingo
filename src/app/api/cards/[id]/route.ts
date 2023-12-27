import { auth } from "@/../auth";
import { getCardOwnerByCardId, updateCardById } from "@/db/queries/cards";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const cardId = params.id;
  const { front, back, image_url } = await request.json();
  const session = await auth();

  if (!session)
    return Response.json({ message: "Please log in first." }, { status: 401 });

  // Validation
  if (!front.trim() || !back.trim()) {
    return Response.json(
      { success: false, message: "Front and back text cannot be empty" },
      { status: 400 }
    );
  }
  try {
    const userId = session.user.id;

    // make sure the user who edits the card is the owner
    const data = await getCardOwnerByCardId(cardId);
    if (data.user_id !== userId)
      return Response.json(
        { message: "You can only edit your own card." },
        { status: 403 }
      );

    // Update the card
    await updateCardById({ front, back, image_url, id: cardId });

    return Response.json(
      { success: true, message: "Card updated successfully" },
      { status: 200 }
    );
  } catch (err) {
    return Response.json(
      { success: false, message: "Error updating card", error: err },
      { status: 500 }
    );
  }
}
