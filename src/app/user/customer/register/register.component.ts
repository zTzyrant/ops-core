import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent{
  datas: any;
  xhttpdatas: Subscription | any;
  public customerregistform: FormGroup | any;

  constructor(public fb: FormBuilder,
      private http: HttpClient,
      private titleService:Title) {
        this.titleService.setTitle("Register Account to OPS")
        this.registerValidform();
  }

  ngOnInit(){

  }


  registerValidform() {
    this.customerregistform = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(5), ]],
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

  chekusernameavilable(){
    let chekusrname = true;
    this.xhttpdatas = this.http.get('http://localhost:3000/datausrname').subscribe(datas => {
      this.datas = datas;
      this.datas = this.datas.payload.datas;


      for(let z = 0; z < this.datas.length; z++){
        if(this.datas[z].username == this.username.value){
          chekusrname = false;
        }
      }

      if(chekusrname){
        Swal.fire(
          'Good job!',
          'Username Avilable!',
          'success'
        )
        
      } else {
        Swal.fire(
          'Error!',
          'Username already used!',
          'error'
        )
        
      }
    })

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
