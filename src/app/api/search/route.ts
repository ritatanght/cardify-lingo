const searches = require("@/db/queries/searches");import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");
  try {
    const sets = await searches.searchByText(query);
    return Response.json(sets);
  } catch (err) {
    console.error(err);
    return Response.json(err, { status: 500 });
  }
}
