import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CurdApiService } from 'src/app/secure/curd.api.service';


@Component({
  selector: 'app-resetpassword',
  template: `
    <div class="container d-flex flex-column">
      <div class="row align-items-center justify-content-center
          min-vh-100">
        <div class="col-12 col-md-8 col-lg-4">
          <div class="card shadow-sm">
            <div class="card-header">
              <h1 class="tagbrandops">OPS</h1>
            </div>
            <div class="card-body">
              <div class="mb-4">
                <h3 class="text-center">Forgot Password?</h3>
                <p class="mb-2 text-center">Please enter your registered email for get new password.</p>
              </div>
              <form [formGroup]="customerResetPassword" (ngSubmit)="submit()">
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input type="email" id="email" class="form-control" name="email" placeholder="Enter Your Email" formControlName="email"
                    [ngClass]="{'is-invalid': customerResetPassword.controls['email'].invalid && (customerResetPassword.controls['email'].dirty ||
                    customerResetPassword.controls['email'].touched), 'is-valid': customerResetPassword.controls['email'].valid}"
                    required="">
                  <div class="invalid-feedback alert alert-danger mt-3 inputcustops">
                      <div *ngIf="email.errors?.['required']">
                          <i class="bi bi-exclamation-octagon"></i>
                          Email is required.
                      </div>
                      <div *ngIf="email.errors?.['isemail']">
                          <i class="bi bi-exclamation-octagon"></i>
                          Please enter valid email.
                      </div>
                  </div>
                </div>
                <div class="mb-3 d-grid">
                  <button type="submit" class="btn btn-primary cusopssub">
                    Reset Password
                  </button>
                </div>
                <span>Don't have an account? <a href="register">sign up</a></span>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@600&family=Righteous&display=swap');
    .tagbrandops{
      font-family: 'Righteous';
      font-style: normal;
      font-weight: 400;
      font-size: 3rem;
      text-align: center;
      line-height: 4rem;
      color: #07484A;
    }

    .cusopssub{
      width: 100%;
      background: #07484A;
      border-radius: 6px;
      height: 55px;
      font-family: 'Inter';
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 19px;
      align-items: center;
      text-align: center;
      color: #FFFFFF;
    }

    .cusopssub:hover{
      background: #063839 !important;
      background-color: #063839 !important;
    }

    .cusopssub:active{
      background: #052d2e !important;
      background-color: #052d2e !important;
      border-color: #14494a !important;
    }

  `]
})
export class ResetpasswordComponent {

  public customerResetPassword: FormGroup | any;

  constructor(public fb: FormBuilder,private curdService: CurdApiService,){
    this.checkdatas();
  }


  checkdatas() {
    this.customerResetPassword = this.fb.group({
      email: ['', [Validators.required, this.regexValidemail]]
    });
  }

  regexValidemail(control: FormControl){
    let isemail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,100}$/.test(control.value);
    if (!isemail) {
      return {isemail: true};
    }
    return null;
  }

  get email(){
    return this.customerResetPassword.get('email');
  }

  submit(){
    alert("what")

    this.curdService.requestRestartPassword(this.customerResetPassword.value.email).subscribe(respone => {
      let temp: any;
      temp = respone; 
      if(temp === '1'){
        alert("what")
      }
    
    })
  }


}
