import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DevService } from 'src/app/secure/auth/dev.service';
import { CurdApiService } from 'src/app/secure/curd.api.service';

@Component({
  selector: 'app-login-developer',
  templateUrl: 'logindeveloper.html',
  styleUrls: ['logindeveloper.css',
    '../../../assets/css/argon-dashboard.css',
  ],
})
export class LogindeveloperComponent{
  logindevFormNew = this.fb.group({
    username: ['', [Validators.required, this.noWhitespaceValidator]],
    password: ['', [Validators.required, this.noWhitespaceValidator]]
  })

  constructor(
    public fb: FormBuilder,
    private curdService: CurdApiService,
    private toast : ToastrService,
    private router: Router,
    private devService: DevService,
  ){

  }

  ngOnInit(){
    if(localStorage.getItem('__$DEV__TOKEN__')){
      this.devService.checkSessionDeveloper().subscribe((result: any) => {
        console.log(result)
        if(result === 1)
          this.router.navigate(['../developer/dashboard'])
        else {
          localStorage.removeItem('__$DEV__TOKEN__')
          this.toast.error('Invalid Login Token', 'Please Login Again')  
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
    this.curdService.requestDEVlogin(this.logindevFormNew.value).subscribe((datas:any) => {
      if(datas.statusLogin === '1'){
        this.toast.info('Successfully Login')
        localStorage.setItem('__$DEV__TOKEN__', datas.authLogin)
        this.router.navigate(['../developer/dashboard'])
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