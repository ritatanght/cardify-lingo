const languages = require("@/db/queries/languages");
export async function GET(request: Request) {
  try {
    const data = await languages.getAllLanguages();
    return Response.json(data);
  } catch (err) {
    console.error(err);
    return Response.json(
      { message: "Error fetching languages" },
      {
        status: 500,
      }
    );
  }
}
