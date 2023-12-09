import { auth } from "../../../../../auth";

const favorites = require("@/../db/queries/favorites");

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const userId = params.id;
  try {
    const favoriteSets = await favorites.getFavoritesByUserId(userId);
    return Response.json(favoriteSets);
  } catch (err) {
    return Response.json({ message: err }, { status: 500 });
  }
}
