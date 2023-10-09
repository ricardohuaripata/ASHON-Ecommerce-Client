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
import { UserFavoritesComponent } from './pages/user-profile/user-favorites/user-favorites.component';
import { UserReviewsComponent } from './pages/user-profile/user-reviews/user-reviews.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { SocialAuthComponent } from './auth/social-auth/social-auth.component';

const routes: Routes = [
  { path: '', component: HomeComponent, title: 'HOME - ASHON' },
  { path: 'account/login', component: LoginComponent, title: 'LOGIN - ASHON' },
  { path: 'account/social-authentication', component: SocialAuthComponent, title: 'SOCIAL AUTH - ASHON' },
  { path: 'account/register', component: RegisterComponent, title: 'REGISTER - ASHON' },
  { path: 'account/verify-email/:token', component: EmailVerificationComponent, title: 'VERIFY EMAIL - ASHON' },
  { path: 'account/reset-password/:token', component: ResetPasswordComponent, title: 'RESET PASSWORD - ASHON' },
  { path: 'collections/men', component: MenComponent, title: 'MEN - ASHON' },
  { path: 'collections/women', component: WomenComponent, title: 'WOMEN - ASHON' },
  { path: 'collections/men/:categoryName', component: MenCategoriesComponent },
  { path: 'collections/women/:categoryName', component: WomenCategoriesComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'search/:searchParam', component: SearchPageComponent },
  { path: 'account', component: UserProfileComponent, title: 'ACCOUNT - ASHON', canActivate: [AuthGuard] },
  { path: 'account/my-favorites', component: UserFavoritesComponent, title: 'MY FAVORITES - ASHON', canActivate: [AuthGuard] },
  { path: 'account/my-reviews', component: UserReviewsComponent, title: 'MY REVIEWS - ASHON', canActivate: [AuthGuard] },
  { path: 'account/my-orders', component: UserOrdersComponent, title: 'MY ORDERS - ASHON', canActivate: [AuthGuard] },
  { path: 'account/my-orders/:orderId', component: UserOrderDetailsComponent, title: 'MY ORDERS - ASHON', canActivate: [AuthGuard] },
  { path: 'shopping-cart', component: ShoppingCartComponent, title: 'CART - ASHON', canActivate: [AuthGuard] },
  { path: 'shopping-cart/checkout', component: PaymentGatewayComponent, title: 'CHECKOUT - ASHON', canActivate: [AuthGuard] },
  //controlar pagina no encontrada
  {path: '**', component: PageNotFoundComponent, title: '404 PAGE NOT FOUND - ASHON'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
