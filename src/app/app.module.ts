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
import { LoginComponent } from './user/customer/login/login.component';
import { HeaderComponent } from './core/header/header.component';
import { ProfileComponent } from './user/customer/profile/profile.component';
import { ResetpasswordComponent } from './user/customer/resetpassword/resetpassword.component';
import { ChangedpasswordComponent } from './user/customer/api/changedpassword/changedpassword.component';
import { MerchantpageComponent } from './merchant/merchantpage/merchantpage.component';
import { DetailsproductComponent } from './merchant/detailsproduct/detailsproduct.component';


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

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
  ],
  providers: [
    CurdApiService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
