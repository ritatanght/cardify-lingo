const sets = require("@/../db/queries/sets");
const cards = require("@/../db/queries/cards");
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
