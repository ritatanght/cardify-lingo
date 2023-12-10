import { auth } from "../../../../../auth";
const sets = require("@/../db/queries/sets");
const users = require("@/../db/queries/users");
// profile page
export async function GET(request: Request) {
  const session = await auth();

  if (session) {
    const email = session.user?.email;
    try {
      const user = await users.getUserInfoByEmail(email);
      const data = await sets.getSetsByUserId(user.id);
      return Response.json(data, { status: 200 });
    } catch (err) {
      console.error(err);
      return Response.json({ message: "Error fetching sets" }, { status: 500 });
    }
  } else {
    return Response.json({ message: "Login to view profile" }, { status: 400 });
  }
}
