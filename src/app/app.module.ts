import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { HttpClientModule } from '@angular/common/http';
import { CategoryComponent } from './category/category.component';
import { RegisterComponent } from './user/customer/register/register.component'
import { ReactiveFormsModule } from '@angular/forms';
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

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    NgxMaterialTimepickerModule,
  ],
  providers: [
    CurdApiService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
