import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CurdApiService } from 'src/app/secure/curd.api.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./stylelog.css']
})
export class LoginComponent {
  btnloginwith = true;
  passwordinputtype = true;
  public loginform: FormGroup | any;
  constructor(public fb: FormBuilder,
    private curdService: CurdApiService,
    private toast : ToastrService
  ){
    this.loginvalid();
  }

  ngOnInit(){
    this.email.value = 'unused';
    this.curdService.checkloginlegal();
  }

  changeLoginWith(val: any){
    this.btnloginwith = val;
    if(this.btnloginwith){
      this.username.value = '';
      this.email.value = 'unused';
    } else {
      this.email.value = '';
      this.username.value = 'unused';
    }
  }
  tooglepassword(){
    this.passwordinputtype = !this.passwordinputtype;
  }

  loginvalid() {
    this.loginform = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

  }

  encryptPassword(){
    
  }

  login(){

    this.loginform.value.password = this.curdService.encryptPassword(this.loginform.value.password)
    this.curdService.logincustomer(this.loginform.value).subscribe(response => {
      let tempResponse : any;
      tempResponse = response;
      if(tempResponse.statusCode === 200){
        console.log(tempResponse);
        localStorage.setItem('logindatas', JSON.stringify(tempResponse));
        Swal.fire(
          'Good job!',
          `Success login to OPS database`,
          'success'
        ).then(function (){location.reload()})
      } else {
        this.toast.error('Invalid username or password !');
      }
    })
  }

  strongUpper(control: FormControl){
    let hasUpper = /[A-Z]/.test(control.value);
    const valid = hasUpper;
    if (!valid) {
      return { strongUpper: true };
    }
    return null;
  }

  get password() {
    return this.loginform.get('password');
  }

  get email() {
    return this.loginform.get('email');

  }
  get username(){
    return this.loginform.get('username');
  }
}
