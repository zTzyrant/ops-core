import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { CategoryComponent } from './category/category.component';
import { RegisterComponent } from './user/customer/register/register.component';
import { ProfileComponent } from './user/customer/profile/profile.component';
import { ResetpasswordComponent } from './user/customer/resetpassword/resetpassword.component';
import { ChangedpasswordComponent } from './user/customer/api/changedpassword/changedpassword.component';

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
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
