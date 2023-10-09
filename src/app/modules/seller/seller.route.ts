import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { sellerController } from './seller.controller';
import { sellerZodSchema } from './seller.validation';

const router = Router();

router.get('/', sellerController.getAll);
router.get('/:id', sellerController.getById);
router.patch('/:id', validateRequest(sellerZodSchema.update), sellerController.update);
router.delete('/:id', sellerController.remove);

export const sellerRouter = router;
