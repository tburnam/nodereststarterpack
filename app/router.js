import { Router } from 'express';

import * as Users from './controllers/user_controller';
import { requireAuth, requireSignin } from './services/passport';

const router = Router();

router.get('/', (req, res) => {
  res.send('API is online!');
});

router.post('/signin', requireSignin, Users.signin);
router.post('/signup', Users.signup);
router.get('/users', requireAuth, Users.getUser);
router.route('/users/:id')
  .put(requireAuth, Users.updateUser);

export default router;
