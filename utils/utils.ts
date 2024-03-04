import jwt from "jsonwebtoken";

export const JWT_PRIVATE_KEY = "BLOCKPROJECT";

export const createJWT = (user: any) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      time: Date.now(),
    },
    JWT_PRIVATE_KEY,
    {
      expiresIn: "72h",
    }
  );
};

export const validateToken = (token: string) => {
  const user = jwt.verify(token, JWT_PRIVATE_KEY);
  return user;
};
// PARA REFERALL
export const generateRandomString = (num: number) => {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result1 = "";
  const charactersLength = characters.length;
  for (let i = 0; i < num; i++) {
    result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result1;
};

export const normalizeResponse = ({
  data,
  error,
  token,
}: {
  data?: any;
  error?: any;
  token?: string;
}) => ({
  data,
  error,
  token,
  ok: data && !error,
});
