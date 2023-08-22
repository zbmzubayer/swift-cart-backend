import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { categoryController } from './category.controller';
import { categoryZodSchema } from './category.validation';

const router = Router();

router.post('/', validateRequest(categoryZodSchema.create), categoryController.create);
router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);
router.patch('/:id', validateRequest(categoryZodSchema.update), categoryController.update);
router.delete('/:id', categoryController.remove);

export const categoryRouter = router;
