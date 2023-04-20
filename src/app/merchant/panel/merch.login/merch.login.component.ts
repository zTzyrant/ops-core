import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MerchantApiService } from 'src/app/secure/merchant/merchant.api.service';
import { CurdApiService } from 'src/app/secure/curd.api.service';

@Component({
  selector: 'app-merch.login',
  templateUrl: 'merch.login.html',
  styleUrls: ['merch.login.css',
    '../../../../assets/css/argon-dashboard.css',
  ],
})

export class MerchLoginComponent {
  logindevFormNew = this.fb.group({
    username: ['', [Validators.required, this.noWhitespaceValidator]],
    password: ['', [Validators.required, this.noWhitespaceValidator]]
  })

  constructor(
    private curdService: CurdApiService,
    public fb: FormBuilder,
    private toast : ToastrService,
    private router: Router,
    private merchantApi: MerchantApiService
  ){

  }

  ngOnInit(){
    if(localStorage.getItem('$admin@merchant')){
      this.merchantApi.checkSessionMerchant().subscribe((result: any) => {
        if(result.statQuo !== '1'){
          this.router.navigate(['/merchant/admin/login'])
          localStorage.removeItem('$admin@merchant')
          localStorage.removeItem('_____$AdminDatas_____')
          this.toast.error('Invalid Login Token', 'Please Login Again')
        } else {
          this.router.navigate(['/merchant/admin/dashboard'])
        }
      }) 
    }
  }

  loginDeveloper(){
    if(this.logindevFormNew.invalid){
      this.toast.error('Please check your inputed data !', 'Form data cannot be null')
      this.logindevFormNew.markAllAsTouched();
      return 
    }
    
    this.logindevFormNew.value.password = this.curdService.encryptPassword(this.logindevFormNew.value.password)
    this.merchantApi.requestMerchantlogin(this.logindevFormNew.value).subscribe((datas:any) => {
      if(datas.statusLogin === '1'){
        this.toast.info('Successfully Login')
        localStorage.setItem('$admin@merchant', datas.authLogin)
        this.router.navigate(['/merchant/admin/dashboard'])
      } else {
        this.toast.error('Invalid Username or Password')        
      }
    })
  }

  noWhitespaceValidator(control: FormControl) {
    const isSpace = (control.value || '').match(/\s/g);
    return isSpace ? {'whitespace': true} : null;
  }
}
