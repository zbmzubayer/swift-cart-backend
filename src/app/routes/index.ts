import { Router } from 'express';
import { categoryRouter } from '../modules/category/category.route';
import { customerRouter } from '../modules/customer/customer.route';
import { subCategoryRouter } from '../modules/sub-category/sub-category.route';

type ModuleRoute = {
  path: string;
  routes: Router;
};

const router = Router();

const moduleRoutes: ModuleRoute[] = [
  {
    path: '/customer',
    routes: customerRouter,
  },
  {
    path: '/category',
    routes: categoryRouter,
  },
  {
    path: '/sub-category',
    routes: subCategoryRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.routes));

export default router;
