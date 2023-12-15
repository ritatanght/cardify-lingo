const users = require("@/db/queries/users");import { DatabaseError } from "pg";
import { auth } from "../../../../auth";
import bcrypt from "bcrypt";

export async function GET(req: any, res: any) {
  const session = await auth();

  try {
    const user = await users.getUserInfoByEmail(session?.user?.email);

    return Response.json(user, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Error fetching user" }, { status: 500 });
  }
}

// register user
export async function POST(request: Request) {
  const res = await request.json();
  const { email, username, password } = res;

  if (!email || !username || !password) {
    return Response.json(
      { message: "Fields cannot be blank" },
      { status: 400 }
    );
  }
  if (password.trim().length < 6)
    return Response.json(
      { message: "Password must be at least 6 in length" },
      { status: 400 }
    );

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await users.createCredUser(email, username, hash);

    return Response.json(user, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof DatabaseError && err.code === "23505") {
      return Response.json(
        {
          message: "An account with this email address already exists.",
        },
        { status: 400 }
      );
    } else {
      console.error(err);
      return Response.json(
        { message: "Unable to create user" },
        { status: 500 }
      );
    }
  }
}
