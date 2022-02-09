export const jwtConstants = () => {
  console.log('secret', process.env.JWT_SECRET);
  return { secret: process.env.JWT_SECRET };
};
