import { Card, Set } from "@/app/lib/definitions";
import { auth } from "../../../../../auth";
const cards = require("@/../db/queries/cards");
const users = require("@/../db/queries/users");

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const cardId = params.id;
  const { front, back } = await request.json();
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
    const user = await users.getUserInfoByEmail(session.user?.email);
    // make sure the user who edits the card is the owner
    const data = await cards.getCardOwnerByCardId(cardId);
    if (data.user_id !== user.id)
      return Response.json(
        { message: "You can only edit your own card." },
        { status: 403 }
      );

    // Update the card
    await cards.updateCardById(cardId, { front, back });

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
