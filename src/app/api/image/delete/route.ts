import { del } from "@vercel/blob";

export const runtime = "edge";

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const urlToDelete = searchParams.get("url") as string;
  if (urlToDelete) {
    await del(urlToDelete);
    return Response.json({ status: 204 });
  } else {
    return Response.json({ status: 400 });
  }
}
