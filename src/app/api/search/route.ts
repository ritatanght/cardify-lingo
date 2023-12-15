import { searchByText } from "@/db/queries/searches";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");
  try {
    if (query) {
      const sets = await searchByText(query);
      return Response.json(sets);
    } else {
      return Response.json([]);
    }
  } catch (err) {
    console.error(err);
    return Response.json(err, { status: 500 });
  }
}
