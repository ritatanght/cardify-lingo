const languages = require("@/db/queries/languages");const sets = require("@/db/queries/sets");
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const languagePromise = languages.getLanguageById(id);
  const setsPromise = sets.getSetsByLanguageId(id);
  try {
    const [language, sets] = await Promise.all([languagePromise, setsPromise]);
    if (!language)
      return Response.json({ message: "Language not found" }, { status: 404 });
    return Response.json({ language: language.name, sets });
  } catch (err) {
    console.error(err);
  }
}
