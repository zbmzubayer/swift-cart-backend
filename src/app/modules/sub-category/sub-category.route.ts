import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { subCategoryController } from './sub-category.controller';
import { subCategoryZodSchema } from './sub-category.validation';

const router = Router();

router.post('/', validateRequest(subCategoryZodSchema.create), subCategoryController.create);
router.get('/', subCategoryController.getAll);
router.get('/:id', subCategoryController.getById);
router.patch('/:id', validateRequest(subCategoryZodSchema.update), subCategoryController.update);
router.delete('/:id', subCategoryController.remove);

export const subCategoryRouter = router;
