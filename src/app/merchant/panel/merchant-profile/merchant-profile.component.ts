import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DevService } from 'src/app/secure/auth/dev.service';
import { CurdApiService } from 'src/app/secure/curd.api.service';
import { MerchantApiService } from 'src/app/secure/merchant/merchant.api.service';

@Component({
  selector: 'app-merchant-profile',
  templateUrl: 'merchant-profile.html',
  styleUrls: ['./merchant-profile.css',
    '../merch.dashboard/merchdashboard.css',
    '../../../../assets/css/argon-dashboard.css',
    "../../../../assets/css/nucleo-svg.css",
    "../../../../assets/css/nucleo-icons.css",
  ]
})
export class MerchantProfileComponent {
  devDatas: any;
  stringJson = localStorage.getItem('_____$AdminDatas_____')
  jsonData = JSON.parse(this.stringJson!)
  changesDatas = 0
  listManage = {updateFullname: false, updateGender: false}
  formUpdateProfile: FormGroup | any
  editable = true
  showNav = false
  
  constructor(
    public fb: FormBuilder,
    private curdService: CurdApiService,
    private toast : ToastrService,
    private router: Router,
    private devService: DevService,
    private sanitizer: DomSanitizer,
    private merchantApi: MerchantApiService,

  ){
    if(localStorage.getItem('$admin@merchant')){
      this.merchantApi.checkValidLoginMerchant(localStorage.getItem('$admin@merchant'))
      this.devDatas = JSON.parse(localStorage.getItem('_____$AdminDatas_____')!)
    }
    this.validManageProfile()

    
    this.formUpdateProfile.controls['fullname'].disable();
    this.formUpdateProfile.controls['gender'].disable();

    console.log(this.jsonData);
  }

  setShowNav(){
    this.showNav = !this.showNav
  }

  signDevOut(){ this.devService.destroyDevSid() }

  validManageProfile(){
    this.formUpdateProfile = this.fb.group({
      userid: [`${this.jsonData.userid}`, [Validators.required]],
      fullname: [`${this.jsonData.fullname}`, [Validators.required]],
      gender: [`${this.jsonData.gender}`, [Validators.required]],
    })
  }

  editSomeDatas(forDatas: any){    
    this.changesDatas++;
    
    
    if(forDatas === 'fullname'){
      this.listManage.updateFullname = true
      this.formUpdateProfile.controls['fullname'].enable();

    }
    if(forDatas === 'gender'){
      this.listManage.updateGender = true
      this.formUpdateProfile.controls['gender'].enable();
    }



  }

  cancelSomeDatas(forDatas: any){

    if(forDatas === 'fullname'){
      this.formUpdateProfile.controls['fullname'].disable();
      this.listManage.updateFullname = false
    }
    if(forDatas === 'gender'){
      this.formUpdateProfile.controls['gender'].disable();
      this.listManage.updateGender = false
    }
    this.changesDatas--;
  }
  
  get fullname(){
    return this.formUpdateProfile.get('fullname')
  }

  get gender(){
    return this.formUpdateProfile.get('gender')
  }

  submitChangesProfile(){

    if(this.formUpdateProfile.invalid){
      this.toast.info("Please Don't Input Invalid Data")
      this.fullname.setValue(this.jsonData.fullname)
      this.gender.setValue(this.jsonData.gender)
      return
    }
    this.formUpdateProfile.controls['fullname'].enable();
    this.formUpdateProfile.controls['gender'].enable();
    
    let upData = ({ 
        email: this.jsonData.email, 
        fullname: this.formUpdateProfile.value.fullname,
        gender: this.formUpdateProfile.value.gender
      })

    console.log(upData);
    this.curdService.reqUpdateUserAccount(upData).subscribe(res =>{
      let response = res
      if(response === 1){
        this.toast.success('Successfully Update Acount Information')

        this.merchantApi.checkValidLoginMerchant(localStorage.getItem('$admin@merchant'))
        this.stringJson = localStorage.getItem('$admin@merchant')
        this.jsonData = JSON.parse(this.stringJson!)
        
        this.listManage.updateFullname= false
        this.listManage.updateGender = false
        this.changesDatas = 0
      } else {
        this.toast.error('Something Went Wrong Please Contact Admin!')
      }
      
    })
    
    this.formUpdateProfile.controls['fullname'].disable();
    this.formUpdateProfile.controls['gender'].disable();
    
  }
}
