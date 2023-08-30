import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { orderController } from './order.controller';
import { orderZodSchema } from './order.validation';

const router = Router();

router.post('/', validateRequest(orderZodSchema.create), orderController.create);
router.get('/', orderController.getAll);
router.get('/:id', orderController.getById);
router.patch('/:id', validateRequest(orderZodSchema.update), orderController.update);
router.patch('/:id/cancel', orderController.cancelOrder);
router.patch('/:id/refund', orderController.cancelOrder);
router.patch('/:id/deliver', orderController.deliverOrder);

export const orderRouter = router;
