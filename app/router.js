import { Router } from 'express';
import dotenv from 'dotenv';
import { requireAuth, requireSignin } from './services/passport';


const router = Router();
dotenv.config({ silent: true });

router.get('/', (req, res) => {
  const x = process.env.AUTH_SECRET;
  res.json({ message: `welcome to my REST API starterkit (with user auth)!` });
});


export default router;
