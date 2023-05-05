import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CurdApiService } from 'src/app/secure/curd.api.service';
import Swal from 'sweetalert2';

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
    this.editFormAddAddress()
    this.getAllAddress()
    
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

  editAddressForm: any
  collectionAddress: any
  selectedAddressDatas: any
  deleteButtonId: any

  getAllAddress(){
    this.collectionAddress = null
    this.selectedAddressDatas = null
    this.curdService.getAllAddress(this.jsonData.fields[0].userid).subscribe((res: any) => {
      if(res.statQuo === 1){
        this.collectionAddress = res.fields
      } else {
        this.toast.error('Something Went Wrong Please Contact Customer Support!')
      }
    })
  }

  selectedAddress(event: any){
    this.selectedAddressDatas = undefined
    
    this.collectionAddress.forEach((element: any) => {
      if(element.addressid === parseInt(event.target.value)){
        this.selectedAddressDatas = element
        this.setEditableAddress()
      }
    });
  }

  setEditableAddress(){
    this.editAddressForm.controls['userid'].setValue(this.selectedAddressDatas.userid);
    this.editAddressForm.controls['addressid'].setValue(this.selectedAddressDatas.addressid);
    this.editAddressForm.controls['fulladdress'].setValue(this.selectedAddressDatas.fulladdress);
    this.editAddressForm.controls['city'].setValue(this.selectedAddressDatas.city);
    this.editAddressForm.controls['postcode'].setValue(this.selectedAddressDatas.postcode);
    this.editAddressForm.controls['phoneaddress'].setValue(this.selectedAddressDatas.phoneAddress);
    this.editAddressForm.controls['note'].setValue(this.selectedAddressDatas.note);
    this.deleteButtonId = this.selectedAddressDatas.addressid
  }

  editFormAddAddress(){
    this.editAddressForm = this.fb.group({
      userid: ['', Validators.required],
      addressid: ['', Validators.required],
      fulladdress: ['', Validators.required], 
      city: ['', Validators.required], 
      postcode: ['', Validators.required], 
      phoneaddress: ['', [Validators.required, Validators.pattern('^[0-9]*$')]], 
      note: [''],
    })
  }

  deleteAddress(id:any) {
    Swal.fire({
      title: 'Delete ?',
      text: 'Are you sure want to delete this address data ?',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#07484A'
    }).then((result) => {
      if(result.isConfirmed){
        this.curdService.deleteAddress({id: id}).subscribe((res: any) => {
          if(res === 1){
            this.getAllAddress()
            this.toast.success('Address Deleted')
          } else {
            this.toast.error('Something Went Wrong Please Contact Customer Support!')
          }
        })
      }
    })
  }

  submitEditAddress(){
    if(this.editAddressForm.invalid){
      this.toast.error('Please fill all the fields')
      this.toast.info('Data reset to default')
      this.setEditableAddress()
      return
    }

    this.curdService.updateAddress(this.editAddressForm.value).subscribe((res: any) => {
      if(res === 1){
        this.getAllAddress()
        this.toast.success('Address Updated')
      } else {
        this.toast.error('Something Went Wrong Please Contact Customer Support!')
      }
    })

  }

}
