import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { customerController } from './customer.controller';
import { customerZodSchema } from './customer.validation';

const router = Router();

router.post('/', validateRequest(customerZodSchema.create), customerController.create);
router.get('/', customerController.getAll);
router.get('/:id', customerController.getById);
router.patch('/:id', validateRequest(customerZodSchema.update), customerController.update);
router.delete('/:id', customerController.remove);

export const customerRouter = router;
