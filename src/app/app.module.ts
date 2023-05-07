import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { HttpClientModule } from '@angular/common/http';
import { CategoryComponent } from './category/category.component';
import { RegisterComponent } from './user/customer/register/register.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CurdApiService } from './secure/curd.api.service';

//toastr
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

// ngx material timepicker
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { LoginComponent } from './user/customer/login/login.component';
import { HeaderComponent } from './core/header/header.component';
import { ProfileComponent } from './user/customer/profile/profile.component';
import { ResetpasswordComponent } from './user/customer/api/resetpassword/resetpassword.component';
import { ChangedpasswordComponent } from './user/customer/api/changedpassword/changedpassword.component';
import { MerchantpageComponent } from './merchant/merchantpage/merchantpage.component';
import { DetailsproductComponent } from './merchant/detailsproduct/detailsproduct.component';
import { DashboardComponent } from './developer/dashboard/dashboard.component';
import { MerchantComponent } from './developer/merchant/merchant.component';
import { AdminprintingComponent } from './developer/adminprinting/adminprinting.component';
import { MerchantproductComponent } from './developer/merchantproduct/merchantproduct.component';
import { NotFoundComponent } from './core/errorpage/not-found/not-found.component';
import { FooterComponent } from './core/footer/footer.component';
import { LogindeveloperComponent } from './developer/login/logindeveloper.component';
import { DevGuard } from './secure/auth/dev.guard';
import { DevService } from './secure/auth/dev.service';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MerchAdminprintingComponent } from './merchant/panel/merch.adminprinting/merch.adminprinting.component';
import { MerchLoginComponent } from './merchant/panel/merch.login/merch.login.component';
import { MerchProductComponent } from './merchant/panel/merch.product/merch.product.component';
import { MerchDashboardComponent } from './merchant/panel/merch.dashboard/merchdashboard.component';
import { MerchantApiService } from './secure/merchant/merchant.api.service';
import { MerchantGuard } from './secure/merchant/merchant.guard';
import { CartComponent } from './user/customer/cart/cart.component';
import { SafePipe } from './safe.pipe';
import { ShipmentComponent } from './user/customer/shipment/shipment.component';
import { AddAddressComponent } from './user/customer/add/address/add.address.component';
import { CalculatePaperWeightComponent } from './core/calculate-paper-weight/calculate-paper-weight.component';
import { PaymentComponent } from './core/save/payment/payment.component';
import { details_orderComponent } from './order/view/details/details_order.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    CategoryComponent,
    RegisterComponent,
    LoginComponent,
    HeaderComponent,
    ProfileComponent,
    ResetpasswordComponent,
    ChangedpasswordComponent,
    MerchantpageComponent,
    DetailsproductComponent,
    DashboardComponent,
    MerchantComponent,
    AdminprintingComponent,
    MerchantproductComponent,
    NotFoundComponent,
    FooterComponent,
    LogindeveloperComponent,
    FooterComponent,
    MerchDashboardComponent,
    MerchAdminprintingComponent,
    MerchLoginComponent,
    MerchProductComponent,
    CartComponent,
    SafePipe,
    ShipmentComponent,
    AddAddressComponent,
    CalculatePaperWeightComponent,
    PaymentComponent,
    details_orderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    NgxMaterialTimepickerModule,
    Ng2SearchPipeModule,
  ],
  providers: [
    CurdApiService, DevGuard, DevService, MerchantApiService, MerchantGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
