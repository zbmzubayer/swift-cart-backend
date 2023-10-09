import { Router } from 'express';
import { adminRouter } from '../modules/admin/admin.route';
import { authRouter } from '../modules/auth/auth.route';
import { categoryRouter } from '../modules/category/category.route';
import { customerRouter } from '../modules/customer/customer.route';
import { orderRouter } from '../modules/order/order.route';
import { productRouter } from '../modules/product/product.route';
import { reviewRouter } from '../modules/review/review.route';
import { sellerRouter } from '../modules/seller/seller.route';
import { subCategoryRouter } from '../modules/sub-category/sub-category.route';
import { userRouter } from '../modules/user/user.route';

type ModuleRoute = {
  path: string;
  routes: Router;
};

const router = Router();

const moduleRoutes: ModuleRoute[] = [
  {
    path: '/auth',
    routes: authRouter,
  },
  {
    path: '/user',
    routes: userRouter,
  },
  {
    path: '/admin',
    routes: adminRouter,
  },
  {
    path: '/customer',
    routes: customerRouter,
  },
  {
    path: '/seller',
    routes: sellerRouter,
  },
  {
    path: '/category',
    routes: categoryRouter,
  },
  {
    path: '/sub-category',
    routes: subCategoryRouter,
  },
  {
    path: '/product',
    routes: productRouter,
  },
  {
    path: '/order',
    routes: orderRouter,
  },
  {
    path: '/review',
    routes: reviewRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.routes));

export default router;
