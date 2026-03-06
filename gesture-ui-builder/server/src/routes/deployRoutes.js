import express from 'express';
import { deployProject, getDeployments } from '../controllers/deploymentController.js';

const router = express.Router();

router.post('/', deployProject);
router.get('/:projectId', getDeployments);

export default router;