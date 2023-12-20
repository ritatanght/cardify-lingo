export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/profile", "/sets/create", "/sets/edit/:path*"],
};
