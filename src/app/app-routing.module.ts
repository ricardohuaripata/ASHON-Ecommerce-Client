import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// guards, proteger las rutas que requieran de iniciar sesion, osea de tener un token en local storage)
import { AuthGuard } from './utils/auth.guard';

import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { MenComponent } from './pages/collections/men/men.component';
import { WomenComponent } from './pages/collections/women/women.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { ShoppingCartComponent } from './pages/shopping-cart/shopping-cart.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { MenCategoriesComponent } from './pages/collections/men/men-categories/men-categories.component';
import { WomenCategoriesComponent } from './pages/collections/women/women-categories/women-categories.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { PaymentGatewayComponent } from './pages/payment-gateway/payment-gateway.component';
import { UserOrdersComponent } from './pages/user-profile/user-orders/user-orders.component';
import { UserOrderDetailsComponent } from './pages/user-profile/user-orders/user-order-details/user-order-details.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { EmailVerificationComponent } from './pages/email-verification/email-verification.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'account/login', component: LoginComponent },
  { path: 'account/register', component: RegisterComponent },
  { path: 'collections/men', component: MenComponent },
  { path: 'collections/women', component: WomenComponent },
  { path: 'collections/men/:categoryName', component: MenCategoriesComponent },
  { path: 'collections/women/:categoryName', component: WomenCategoriesComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'search/:searchParam', component: SearchPageComponent },
  { path: 'verify-email/:token', component: EmailVerificationComponent },
  { path: 'account', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'account/my-orders', component: UserOrdersComponent, canActivate: [AuthGuard] },
  { path: 'account/my-orders/:orderId', component: UserOrderDetailsComponent, canActivate: [AuthGuard] },
  { path: 'shopping-cart', component: ShoppingCartComponent, canActivate: [AuthGuard] },
  { path: 'shopping-cart/checkout', component: PaymentGatewayComponent, canActivate: [AuthGuard] },
  //controlar pagina no encontrada
  {path: '**', component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
