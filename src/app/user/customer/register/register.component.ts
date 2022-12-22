import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import {Title} from "@angular/platform-browser";
import { CurdApiService } from 'src/app/secure/curd.api.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js'
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent{
  passwordinputtype = true;
  datas: any;
  usernames: any;
  rxjs: Subscription | any;
  changme = true;
  usernameold: string[] = [];
  public customerregistform: FormGroup | any;

  constructor(public fb: FormBuilder,
    private titleService: Title,
    private curdService: CurdApiService,
    private toastr: ToastrService
  ) {
      this.titleService.setTitle("Register Account to OPS")
      this.registerValidform();
    }

  checksubmit(){
    let verifusername = true, verifEmail = true, verifPhone = true;
    const tempPassword = this.password.value;
    this.curdService.getUsersname().subscribe(users => {
      this.datas = users;
      this.datas = this.datas.payload.datas;

      for(let z = 0; z < this.datas.length; z++){
        if(this.datas[z].username == this.username.value){
          verifusername = false;          
        }
        if(this.datas[z].email == this.email.value){
          verifEmail = false;          
        }
        if(this.datas[z].phone == this.phone.value){
          verifPhone = false;          
        }
      }

      const encryptPassword = CryptoJS.HmacSHA256(this.password.value, environment.keyEncrypt)
            
      this.customerregistform.value.password = CryptoJS.enc.Base64.stringify(encryptPassword)
      console.log(this.customerregistform.value.password);
      
      
      if(verifusername && verifEmail && verifPhone){
        this.curdService.registercustomer(this.customerregistform.value).subscribe(respone => {
          let temp: any;
          temp = respone;
          if(temp.statussql === 1){
            Swal.fire(
              'Good job!',
              `Success register ${this.fullname.value} to OPS database`,
              'success'
            )
          } else if(temp.statussql === 0) {
            this.toastr.error('Please check your inputed data !', 'Form data cannot be null');
          } else {
            this.toastr.error('Internal Server Error');
          }
          
        })
        
      } else {
        let message = (!verifusername) ? 'Username' : (!verifEmail) ? 'Email!' : 'Phone Number';
        this.toastr.error(`${message} Already used!`);
      }

    });
  }

  tooglepassword(){
    this.passwordinputtype = !this.passwordinputtype;
  }

  registerValidform() {
    this.customerregistform = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required,
        this.strongNumber, this.strongUpper,
        Validators.minLength(6)
      ]],
      email: ['', [Validators.required, Validators.email]],
      fullname: ['', Validators.required],
      genderselect: ['', Validators.required],
      phone: ['', Validators.required],
      agreeterm: ['', Validators.required]
    });
  }

  strongNumber(control: FormControl){
    let hasNumber = /\d/.test(control.value);
    const valid = hasNumber;
    if (!valid) {
      return { strongNumber: true };
    }
    return null;
  }

  strongUpper(control: FormControl){
    let hasUpper = /[A-Z]/.test(control.value);
    const valid = hasUpper;
    if (!valid) {
      return { strongUpper: true };
    }
    return null;
  }

  get username() {
    return this.customerregistform.get('username');
  }

  get password() {
    return this.customerregistform.get('password');
  }

  get email() {
    return this.customerregistform.get('email');
  }

  get fullname() {
    return this.customerregistform.get('fullname');
  }

  get genderselect() {
    return this.customerregistform.get('genderselect');
  }

  get phone(){
    return this.customerregistform.get('phone');
  }

  get agreeterm(){
    return this.customerregistform.get('agreeterm');
  }

}
