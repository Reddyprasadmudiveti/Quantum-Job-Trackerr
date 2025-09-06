import JWT from "jsonwebtoken";
import cookie from "cookie";
export const setCookiesAndToken = (res, payload, options = {}) => {
  const token = JWT.sign(payload, process.env.JWT_SECRET, {
    expiresIn: options.expiresIn || '7d',
    ...options.jwtOptions
  });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
    ...options.cookieOptions
  };

  res.setHeader('Set-Cookie', cookie.serialize('auth', token, cookieOptions));
  return token;
};
