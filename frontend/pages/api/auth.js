import { serialize } from "cookie";
export default function handler(req, res) {
  const auth_data = req.query?.auth_data;
  res.setHeader(
    "Set-Cookie",
    serialize("token", auth_data, {
      path: "/",
      sameSite: "lax",
    })
  );

  res.redirect(`http://${req.headers.host}/login`);
}
