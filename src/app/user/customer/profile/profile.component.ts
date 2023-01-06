import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CurdApiService } from 'src/app/secure/curd.api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent {
  stringJson = localStorage.getItem('logindatas')
  jsonData = JSON.parse(this.stringJson!)
  changesDatas = 0
  listManage = {updateFullname: false, updateGender: false}
  formUpdateProfile: FormGroup | any
  editable = true

  constructor(
    public fb: FormBuilder,
    private curdService: CurdApiService,
    private toast : ToastrService
  ){
    this.validManageProfile()
    
    this.formUpdateProfile.controls['fullname'].disable();
    this.formUpdateProfile.controls['gender'].disable();

    console.log(this.jsonData);
    
  }

  validManageProfile(){
    this.formUpdateProfile = this.fb.group({
      fullname: [`${this.jsonData.fields[0].fullname}`, [Validators.required]],
      gender: [`${this.jsonData.fields[0].gender}`, [Validators.required]],
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
      this.fullname.setValue(this.jsonData.fields[0].fullname)
      this.gender.setValue(this.jsonData.fields[0].gender)
      return
    }
    this.formUpdateProfile.controls['fullname'].enable();
    this.formUpdateProfile.controls['gender'].enable();
    
    let upData = ({ 
        email: this.jsonData.fields[0].email, 
        password: this.jsonData.fields[0].password, 
        fullname: this.formUpdateProfile.value.fullname,
        gender: this.formUpdateProfile.value.gender
      })

    console.log(upData);
    this.curdService.reqUpdateConsumerAccount(upData).subscribe(res =>{
      let response = res
      if(response === 1){
        this.toast.success('Successfully Update Acount Information')
        this.curdService.updateSessionConsumer(this.jsonData.fields[0])

        this.stringJson = localStorage.getItem('logindatas')
        this.jsonData = JSON.parse(this.stringJson!)

        this.listManage.updateFullname= false
        this.listManage.updateGender = false
        this.changesDatas = 0
        this.curdService.checkloginlegal()
      } else {
        this.toast.error('Something Went Wrong Please Contact Admin!')
      }
      
    })
    
    this.formUpdateProfile.controls['fullname'].disable();
    this.formUpdateProfile.controls['gender'].disable();
    
  }
}
