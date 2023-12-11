import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";

const favorites = require("@/../db/queries/favorites");

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = params.id;
  try {
    const favoriteSets = await favorites.getFavoritesByUserId(userId);
    return Response.json(favoriteSets);
  } catch (err) {
    return Response.json({ message: err }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const setId = params.id;
  try {
    const session = await auth();

    if (!session)
      return Response.json({ message: "Login to like a set" }, { status: 400 });
    const userId = session?.user.id;

    await favorites.addFavoriteByUserAndSet(userId, setId);
    return Response.json("success", { status: 201 });
  } catch (err) {
    console.log(err);
    return Response.json({ message: "Error liking the set" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const setId = params.id;

  try {
    const session = await auth();

    if (!session)
      return Response.json({ message: "Login to unlike a set" }, { status: 400 });
    const userId = session?.user.id;
    
    await favorites.removeFavoriteByUserAndSet(userId, setId);
    return Response.json("success", { status: 200 });

  } catch (err) {
    console.log(err);
    return Response.json(
      { message: "Error unliking the set" },
      { status: 500 }
    );
  }
}
