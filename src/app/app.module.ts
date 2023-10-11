import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// modulo necesario para la conexion con el backend
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AddTokenInterceptor } from './utils/add-token.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { ShoppingCartComponent } from './pages/shopping-cart/shopping-cart.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { PaymentGatewayComponent } from './pages/payment-gateway/payment-gateway.component';
import { UserOrdersComponent } from './pages/user-profile/user-orders/user-orders.component';
import { UserOrderDetailsComponent } from './pages/user-profile/user-orders/user-order-details/user-order-details.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { EmailVerificationComponent } from './pages/email-verification/email-verification.component';
import { CookieConsentComponent } from './cookie-consent/cookie-consent.component';
import { UserFavoritesComponent } from './pages/user-profile/user-favorites/user-favorites.component';
import { UserReviewsComponent } from './pages/user-profile/user-reviews/user-reviews.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { OAuthModule } from 'angular-oauth2-oidc';
import { SocialAuthComponent } from './auth/social-auth/social-auth.component';
import { GenreCollectionComponent } from './pages/genre-collection/genre-collection.component';
import { GenreCategoryCollectionComponent } from './pages/genre-category-collection/genre-category-collection.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    RegisterComponent,
    ProductDetailComponent,
    ShoppingCartComponent,
    PageNotFoundComponent,
    UserProfileComponent,
    PaymentGatewayComponent,
    UserOrdersComponent,
    UserOrderDetailsComponent,
    SearchPageComponent,
    EmailVerificationComponent,
    CookieConsentComponent,
    UserFavoritesComponent,
    UserReviewsComponent,
    ResetPasswordComponent,
    SocialAuthComponent,
    GenreCollectionComponent,
    GenreCategoryCollectionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    OAuthModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    // modulo necesario para la conexion con el backend
    HttpClientModule,
    BrowserAnimationsModule, // required animations module
  ],
  providers: [
    // interceptor token
    { provide: HTTP_INTERCEPTORS, useClass: AddTokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
