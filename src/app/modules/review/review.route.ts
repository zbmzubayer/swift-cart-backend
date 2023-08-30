import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { reviewController } from './review.controller';
import { reviewZodSchema } from './review.validation';

const router = Router();

router.post('/', validateRequest(reviewZodSchema.create), reviewController.create);
router.get('/', reviewController.getAll);
router.get('/:id', reviewController.getById);
router.patch('/:id', validateRequest(reviewZodSchema.update), reviewController.update);
router.delete('/:id', reviewController.remove);

export const reviewRouter = router;
