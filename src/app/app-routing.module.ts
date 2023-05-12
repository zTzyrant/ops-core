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
import { LogindeveloperComponent } from './developer/login/logindeveloper.component';
import { FooterComponent } from './core/footer/footer.component';


// GUARD
import { DevGuard } from './secure/auth/dev.guard';
import { MerchDashboardComponent } from './merchant/panel/merch.dashboard/merchdashboard.component';
import { MerchAdminprintingComponent } from './merchant/panel/merch.adminprinting/merch.adminprinting.component';
import { MerchLoginComponent } from './merchant/panel/merch.login/merch.login.component';
import { MerchProductComponent } from './merchant/panel/merch.product/merch.product.component';
import { MerchantGuard } from './secure/merchant/merchant.guard';
import { CartComponent } from './user/customer/cart/cart.component';
import { CustomerGuard } from './secure/customer/customer.guard';
import { ShipmentComponent } from './user/customer/shipment/shipment.component';
import { CalculatePaperWeightComponent } from './core/calculate-paper-weight/calculate-paper-weight.component';
import { PaymentComponent } from './core/save/payment/payment.component';
import { details_orderComponent } from './order/view/details/details_order.component';
import { MerchantDatasComponent } from './merchant/panel/merchant-datas/merchant-datas.component';
import { MerchOrderComponent } from './merchant/panel/merch.order/merch.order.component';
import { MerchSalesReportComponent } from './merchant/panel/merch.sales.report/merch.sales.report.component';
import { OrderhistoryComponent } from './user/customer/orderhistory/orderhistory.component';

const routes: Routes = [
  {
    path: 'homes',
    component: HomepageComponent
  }, {
    path:'',
    component: CategoryComponent
  }, {
    path:'search/:search',
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
    component: DashboardComponent,
    canActivate: [DevGuard]
  }, {
    path: 'developer/dashboard/merchant',
    component: MerchantComponent,
    canActivate: [DevGuard]
  }, {
    path: 'developer/dashboard/adminprinting',
    component: AdminprintingComponent,
    canActivate: [DevGuard]
  }, {
    path: 'developer/dashboard/merchantproduct',
    component: MerchantproductComponent,
    canActivate: [DevGuard]
  }, {
    path: 'developer/login',
    component: LogindeveloperComponent
  }, {
    path: 'footer',
    component: FooterComponent
  },{
    path: 'merchant/admin/dashboard/merchant',
    component: MerchantDatasComponent,
    canActivate: [MerchantGuard]
  }, {
    path: 'merchant/admin/dashboard',
    component: MerchDashboardComponent,
    canActivate: [MerchantGuard]
  }, {
    path: 'merchant/admin/dashboard/adminprinting',
    component: MerchAdminprintingComponent,
  }, {
    path: 'merchant/admin/dashboard/merchantproduct',
    component: MerchProductComponent,
  }, {
    path: 'merchant/admin/dashboard/incomingorder',
    component: MerchOrderComponent,
  }, {
    path: 'merchant/admin/dashboard/salesreport',
    component: MerchSalesReportComponent,
  }, {
    path: 'merchant/admin/login',
    component: MerchLoginComponent
  }, {
    path: 'cart',
    component: CartComponent,
    canActivate: [CustomerGuard]
  }, {
    path: 'cart/shipment',
    component: ShipmentComponent,
    canActivate: [CustomerGuard]
  }, {
    path: 'calculator/paper',
    component: CalculatePaperWeightComponent,
  }, {
    path: 'shop/payment/:id',
    component: PaymentComponent,
  }, {
    path: 'order/view/:id',
    component: details_orderComponent,
  }, {
    path: 'order/history',
    component: OrderhistoryComponent
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
