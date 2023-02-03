import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { CategoryComponent } from './category/category.component';
import { RegisterComponent } from './user/customer/register/register.component';
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

const routes: Routes = [
  {
    path: 'homes',
    component: HomepageComponent
  }, {
    path:'',
    component: CategoryComponent
  }, {
    path: 'register',
    component: RegisterComponent
  }, {
    path: 'user/profile',
    component: ProfileComponent
  }, {
    path: 'gateway/forgotpassword',
    component: ResetpasswordComponent
  }, {
    path: 'api/resetpassword',
    component: ChangedpasswordComponent
  }, {
    path: 'view/:merchantname',
    component: MerchantpageComponent
  }, {
    path: 'view/:merchantname/:productid',
    component: DetailsproductComponent
  }, {
    path: 'developer/dashboard',
    component: DashboardComponent
  }, {
    path: 'developer/dashboard/merchant',
    component: MerchantComponent
  }, {
    path: 'developer/dashboard/adminprinting',
    component: AdminprintingComponent
  }, {
    path: 'developer/dashboard/merchantproduct',
    component: MerchantproductComponent
  }, 


  // end error page
  { 
    path: '404', component: NotFoundComponent 
  }, { 
    path: '**', redirectTo: '404' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
