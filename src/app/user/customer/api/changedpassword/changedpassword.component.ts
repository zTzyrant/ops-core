import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CurdApiService } from 'src/app/secure/curd.api.service';
import * as bcrypt from 'bcryptjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-changedpassword',
  templateUrl: './chagedpassword.html',
  styleUrls: ['chagedpassword.css']
})
export class ChangedpasswordComponent {
  resetpasswordform: FormGroup | any;
  apiEmail: any;
  apiToken: any;
  showPS1: false | any;
  showPS2: false | any;
  equals: "false" | any;

    constructor(
        private route: ActivatedRoute,
        public fb: FormBuilder,
        private curdService: CurdApiService,
        private toast : ToastrService
      ) {
      this.apiEmail = this.route.snapshot.queryParams['email'];
      this.apiToken = this.route.snapshot.queryParams['salt'];
      if(!this.apiToken){
        location.href = '/'
      } else {
        this.curdService.checkSaltTokenEmail(this.apiEmail, this.apiToken).subscribe(response => {
          let validator = response
          if (validator != 1) {
            location.href = '/'
          }
        })
      }
      this.validpassword();

    }

  validpassword() {
    this.resetpasswordform = this.fb.group({
      password: ['', [Validators.required, this.strongNumber, this.strongUpper, Validators.minLength(6)]],
      repeatpassword: ['', [Validators.required]]
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

  passwordRepeated(){

    if(this.password.value === this.repeatpassword.value)
      this.equals = "true"
    else
      this.equals = "false"
  console.log(this.equals );

  }

  get password(){
    return this.resetpasswordform.get('password');
  }

  get repeatpassword(){
    return this.resetpasswordform.get('repeatpassword');
  }

  showPassword(val: any){
    if(val === '1')
      this.showPS1 = !this.showPS1
    else
      this.showPS2 = !this.showPS2
  }
  

  createResetPasswor(){
    if(this.resetpasswordform.invalid){
      this.toast.error('Input Form Cannot Null', 'Please check your input!')
      this.resetpasswordform.markAllAsTouched()
      return
    }
    let newPassword = this.curdService.encryptPassword(this.password.value)
    console.log(newPassword);
    
    this.curdService.requestUpdateConsumerPassword(this.apiEmail, this.apiToken, newPassword).subscribe(stat => {
      let val = stat
      if(val === 1){
        Swal.fire('Success!', 'Your Password Already Chaged!', 'success')
      }
      else{
        Swal.fire('Error', 'Something went wrong. Please contact OPS Core Admin', 'question')
      }
    })
  }
}