import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DevService } from 'src/app/secure/auth/dev.service';
import { CurdApiService } from 'src/app/secure/curd.api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-adminprinting',
  templateUrl: './dev.adminprinting.dashboard.html',
  styleUrls: ['../dashboard/dev.dashboard.css',
    '../../../assets/css/argon-dashboard.css',
    "../../../assets/css/nucleo-svg.css",
    "../../../assets/css/nucleo-icons.css",
  ],
})
export class AdminprintingComponent {
  showNav = false
  merchData: any
  merchAdminDatas: any
  merchSelected = false
  touchedSelected: any
  userDatas: any

  constructor(
    public fb: FormBuilder,
    private curdService: CurdApiService,
    private toast : ToastrService,
    private router: Router,
    private devService: DevService,
    private changeDetection: ChangeDetectorRef
  ){
    if(localStorage.getItem('__$DEV__TOKEN__')){
      this.devService.checkValidLoginDev(localStorage.getItem('__$DEV__TOKEN__'))
    }
    this.merchantListDat()
    this.adminNewForm()
    this.adminEditForm()
    // gett all registerd usr
    this.getuserdatas()

  }

  getuserdatas(){
    this.curdService.getUsersname().subscribe((users:any) => {return this.userDatas = users.payload.datas})
  }

  setShowNav(){
    this.showNav = !this.showNav
  }

  signDevOut(){ this.devService.destroyDevSid() }

  // get all merchant to datatables
  merchantListDat(){
    this.curdService.getAllMerchant().subscribe(res => {      
      this.merchData = res      
    })
  }

  selectedMerchGoods(event: any){
    this.merchSelected = false
    this.touchedSelected = event.target.value
    this.newAdminForm.get('merchantid').setValue(event.target.value)
    this.editAdminForm.get('merchantid').setValue(event.target.value)
    this.generateAdminTables(event.target.value)
  }

  generateAdminTables(datax: any){
    this.curdService.getalladminprinting(datax).subscribe((datas:any) => {
      if(datas.length > 0){
        console.log(datas);
        this.merchAdminDatas = datas
        this.changeDetection.detectChanges()
        this.merchSelected = true
        $(document).ready(function () {
          $('#listmerchantadmin').DataTable().destroy()
          $('#listmerchantadmin').DataTable({
            scrollX: true,
          });
        })
      } else {
        this.toast.info("This Merchant doesn't have any Admin Printing !")
      }
    })
  }

  // Validator
  checkusername(){
    let usedIs: any = false
    this.userDatas.forEach((dat:any) => {
      if(dat.username === this.newAdminForm.get('username').value)
        usedIs = true
    });    
    this.usernameUsed = usedIs
  }

  checkEmail(){
    let usedIs: any = false
    this.userDatas.forEach((dat:any) => {
      if(dat.email === this.newAdminForm.get('email').value)
        usedIs = true
    });
    
    this.emailUsed = usedIs
  }

  checkPhone(){
    let usedIs: any = false
    this.userDatas.forEach((dat:any) => {
      if(dat.phone === this.newAdminForm.get('phone').value)
        usedIs = true
    });
    this.phoneUsed = usedIs
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

  noWhitespaceValidator(control: FormControl) {
    const isSpace = (control.value || '').match(/\s/g);
    return isSpace ? {'whitespace': true} : null;
  }

  editcheckusername(){
    let usedIs: any = false
    this.userDatas.forEach((dat:any) => {
      if(dat.username === this.editAdminForm.get('username').value){
        usedIs = true
        if(this.editArrayIndex && this.merchAdminDatas[this.editArrayIndex].username === this.editAdminForm.get('username').value){
          usedIs = false  
        }
      }
    });    
    this.editusernameUsed = usedIs
  }

  editcheckEmail(){
    let usedIs: any = false
    this.userDatas.forEach((dat:any) => {
      if(dat.email === this.editAdminForm.get('email').value){
        usedIs = true
        if(this.editArrayIndex && this.merchAdminDatas[this.editArrayIndex].email === this.editAdminForm.get('email').value){
          usedIs = false  
        }
      }
    });
    
    this.editemailUsed = usedIs
  }

  editcheckPhone(){
    let usedIs: any = false
    this.userDatas.forEach((dat:any) => {
      if(dat.phone === this.editAdminForm.get('phone').value){
        usedIs = true
        if(this.editArrayIndex && this.merchAdminDatas[this.editArrayIndex].phone === this.editAdminForm.get('phone').value){
          usedIs = false  
        }
      }
    });
    this.editphoneUsed = usedIs
  }
  // end validator

  // Create Admin Form
  newAdminForm: any
  usernameUsed = false
  emailUsed = false
  phoneUsed = false
  passwordinputtype = true

  adminNewForm(){
    this.newAdminForm = this.fb.group({
      merchantid: ['', [Validators.required]],
      username: ['', [Validators.required, Validators.minLength(5), this.noWhitespaceValidator]], 
      password: ['', [Validators.required, this.strongNumber, this.strongUpper,  Validators.minLength(6), this.noWhitespaceValidator]], 
      fullname: ['', Validators.required], 
      email: ['', [Validators.required, Validators.pattern(/^[\w-\.+]+@([\w-]+\.)+[\w-]{2,100}$/)]], 
      gender: ['', Validators.required], 
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]], 
      position: ['', Validators.required], 
      cardid: ['', Validators.required]
    })
  }

  submitForm(){
    this.newAdminForm.value.password = this.curdService.encryptPassword(this.newAdminForm.value.password)
    console.log(this.newAdminForm.value)
    
    this.getuserdatas()
    this.checkusername()
    this.checkEmail()
    this.checkPhone()
    
    if(this.newAdminForm.invalid){
      this.toast.error('Please check your inputed data !', 'Form data cannot be null')
      this.newAdminForm.markAllAsTouched()
      return 
    } 
    
    if(!this.usernameUsed && !this.emailUsed && !this.phoneUsed) {
      this.devService.postNewAdmin(this.newAdminForm.value).subscribe((res: any) => {
        if(res === 1){
          this.toast.success('Successfully submit new admin')
          this.getuserdatas()
          this.generateAdminTables(this.touchedSelected)
        } else {
          this.toast.error('Internal Server Error')
        }
      })
    } else {
      this.toast.info("Please Check your inputed value")
      if(this.usernameUsed)
        this.toast.warning("Username already used")
      if(this.emailUsed)
        this.toast.warning("Email already used")
      if(this.phoneUsed)
        this.toast.warning("Phone number already used")
    }
  }

  deleteAdmin(idadmin: any){
    Swal.fire({
      title: 'Delete Admin Merchant ?',
      text: 'By deleting this admin merchant this data cannot be restored.',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#07484A'
    }).then((result) => {
      if(result.isConfirmed){
        this.devService.deleteMerchantAdmin({userid: idadmin}).subscribe((res: any) => {
          if(res === 1){
            this.getuserdatas()
            this.getuserdatas()
            this.generateAdminTables(this.touchedSelected)
            Swal.fire('Success', 'Successfully Delete Merchant', 'success')

          } else{
            Swal.fire('Error', 'Internal Server Error Please contact developer', 'success')
          }
        })
      }
    })
    
  }

  // dev edit admin
  editAdminForm: any
  editusernameUsed = false
  editemailUsed = false
  editphoneUsed = false
  editpasswordinputtype = true
  editUserId: any
  editArrayIndex: any
  adminEditForm(){
    this.editAdminForm = this.fb.group({
      userid: ['', [Validators.required]],
      merchantid: ['', [Validators.required]],
      username: ['', [Validators.required, Validators.minLength(5), this.noWhitespaceValidator]], 
      fullname: ['', Validators.required], 
      email: ['', [Validators.required, Validators.pattern(/^[\w-\.+]+@([\w-]+\.)+[\w-]{2,100}$/)]], 
      gender: ['', Validators.required], 
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]], 
      position: ['', Validators.required], 
      cardid: ['', Validators.required]
    })
  }
  
  editSetFormValue(indx: any, userid: any){
    this.editUserId = userid
    this.editArrayIndex = indx
    this.editAdminForm.setValue({
      userid: `${userid}`,
      merchantid: `${this.editAdminForm.value.merchantid}`,
      username: `${this.merchAdminDatas[indx].username}`,
      fullname: `${this.merchAdminDatas[indx].fullname}`,
      email: `${this.merchAdminDatas[indx].email}`,
      gender: `${this.merchAdminDatas[indx].gender}`,
      phone: `${this.merchAdminDatas[indx].phone}`,
      position: `${this.merchAdminDatas[indx].position}`,
      cardid: `${this.merchAdminDatas[indx].cardid}`
    })
  }

  submitEditForm(){
    if(this.editAdminForm.invalid){
      this.toast.error('Please check your inputed data !', 'Form data cannot be null')
      this.toast.info('All data was reset to default')
      this.editSetFormValue(this.editArrayIndex, this.editUserId)
      return 
    }

    this.devService.updateMerchantAdmin(this.editAdminForm.value).subscribe((res:any) => {
      console.log(res);
      if(res === 1){
        this.getuserdatas()
        this.getuserdatas()
        this.generateAdminTables(this.touchedSelected)
        this.toast.success("Successfully update admin information")
      } else {
        this.toast.error('Internal server error')
      }
    })
  }
}