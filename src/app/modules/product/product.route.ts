import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { productController } from './product.controller';
import { productZodSchema } from './product.validation';

const router = Router();

router.post('/', validateRequest(productZodSchema.create), productController.create);
router.get('/', productController.getAll);
router.get('/:id', productController.getById);
router.patch('/:id', validateRequest(productZodSchema.update), productController.update);
router.delete('/:id', productController.remove);

export const productRouter = router;
