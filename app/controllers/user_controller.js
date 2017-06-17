import jwt from 'jwt-simple';
import User from '../models/user_model';

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.AUTH_SECRET);
}


export const signin = (req, res, next) => {
  res.send({ token: tokenForUser(req.user) });
};

export const signup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;

  if (!email || !password || !username) {
    res.status(422).send('You must provide email, password, and username');
  }

  const newUser = new User();
  newUser.email = req.body.email;
  newUser.password = req.body.password;
  newUser.username = req.body.username;

  newUser.save().then(() => {
    res.send({ token: tokenForUser(newUser) });
  }).catch((error) => {
    res.status(500).json({ error });
  });
};
