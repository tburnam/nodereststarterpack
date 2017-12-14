import jwt from 'jwt-simple';
import User from '../models/user_model';

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({
    sub: user.id,
    iat: timestamp
  }, process.env.AUTH_SECRET);
}

export const getUser = (req, res, next) => {
  User.findById(req.user._id).populate('classes').then((user) => {
    res.json({ user: cleanUser(user) });
  }).catch((error) => {
    res.status(500).send({ error });
  });
};

export const updateUser = (req, res, next) => {
  if (`${req.params.id}` !== `${req.user._id}`) {
    res.status(401).send('You are not authorized to update this user.');
  }
  const promises = [];
  promises.push(User.find({ username: req.body.username }));
  promises.push(User.find({ email: req.body.email }));
  promises.push(User.findById(req.params.id));
  Promise.all(promises).then((values) => {
    const sameUsername = values[0];
    const sameEmail = values[1];
    const user = values[2];
    if (sameUsername.length === 1 && `${sameUsername[0]._id}` !== `${user._id}`) {
      res.status(422).send('There is another user with that username');
    } else if (sameEmail.length === 1 && `${sameEmail[0]._id}` !== `${user._id}`) {
      res.status(422).send('There is another user with that email');
    } else {
      user.update(req.body).then((result) => {
        res.send('User updated!');
      }).catch((error) => {
        res.status(500).send({ error });
      });
    }
  });
};


export const signin = (req, res, next) => {
  res.send({
    token: tokenForUser(req.user)
  });
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
    res.send({
      token: tokenForUser(newUser)
    });
  }).catch((error) => {
    res.status(500).json({
      error
    });
  });
};
