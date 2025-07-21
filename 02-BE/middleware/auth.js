import { expressjwt } from 'express-jwt';


export const requireSignin = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  getToken: (req) => {
    if (req.cookies && req.cookies.token) {
        // console.log("cokiee",req.cookies.token)
      return req.cookies.token;
    }
    return null;
  },
});
