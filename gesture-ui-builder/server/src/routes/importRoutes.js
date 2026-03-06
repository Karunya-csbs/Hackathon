import express from 'express';
import { importWebsite } from '../controllers/websiteImportController.js';

const router = express.Router();

router.post('/', importWebsite);

export default router;