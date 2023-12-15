const users = require("@/db/queries/users");import bcrypt from "bcrypt";

export async function POST(request: Request) {
  const res = await request.json();
  const { email, password } = res;

  if (!email || !password)
    return Response.json(
      { message: "Login details are incorrect." },
      { status: 400 }
    );
  try {
    const user = await users.getUserByEmail(email);

    if (!user)
      return Response.json(
        { message: "Login details are incorrect." },
        { status: 400 }
      );

    const match = await bcrypt.compare(password, user.hashed_password);

    if (match) {
      return Response.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.username,
        },
      });
    } else {
      return Response.json(
        { message: "Login details are incorrect." },
        { status: 400 }
      );
    }
  } catch (err) {
    return Response.json({ message: err }, { status: 500 });
  }
}
