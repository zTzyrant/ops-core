import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DevService } from 'src/app/secure/auth/dev.service';
import { CurdApiService } from 'src/app/secure/curd.api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dev-profile',
  templateUrl: './dev-profile.html',
  styleUrls: ['../dashboard/dev.dashboard.css',
    '../../../assets/css/argon-dashboard.css',
    "../../../assets/css/nucleo-svg.css",
    "../../../assets/css/nucleo-icons.css",
    './dev-profile.css'
  ]
})
export class DevProfileComponent {
  stringJson = localStorage.getItem('_____$DevDatas_____')
  jsonData = JSON.parse(this.stringJson!)
  changesDatas = 0
  listManage = {updateFullname: false, updateGender: false}
  formUpdateProfile: FormGroup | any
  editable = true
  showNav = false

  constructor(
    public fb: FormBuilder,
    private curdService: CurdApiService,
    private devService: DevService,
    private toast : ToastrService
  ){
    this.validManageProfile()

    
    this.formUpdateProfile.controls['fullname'].disable();
    this.formUpdateProfile.controls['gender'].disable();

    console.log(this.jsonData);
    
  }
  ngOnInit(){
    if(localStorage.getItem('__$DEV__TOKEN__')){
      this.devService.checkValidLoginDev(localStorage.getItem('__$DEV__TOKEN__'))
    }
    $(document).ready(function () {
        $('#example').DataTable({scrollX: true});
    });
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

        this.devService.checkValidLoginDev(localStorage.getItem('__$DEV__TOKEN__'))
        this.stringJson = localStorage.getItem('_____$DevDatas_____')
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
