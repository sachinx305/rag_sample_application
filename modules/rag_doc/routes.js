import express from 'express';
import { RagDocController } from './controller.js';

const router = express.Router();

router.post('/', RagDocController.uploadDocumentAndCreateVectorStore.bind(RagDocController));
router.post('/query', RagDocController.userQuery.bind(RagDocController));


export default router; 