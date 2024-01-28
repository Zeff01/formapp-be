import { Router } from 'express';

import users from './users/users.route';
import sessionRouter from './sessions/sessions.route';
import miscRouter from './misc/misc.route';

const router: Router = Router();

router.use('/users', users);
router.use('/sessions', sessionRouter);
router.use('/misc', miscRouter);
// router.use("/projects", projects);

export default router;
