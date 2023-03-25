import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';
import { ToastrService } from 'ngx-toastr';
import { CurdApiService } from 'src/app/secure/curd.api.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js'
import { DevService } from 'src/app/secure/auth/dev.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-merchant',
  templateUrl: './dev.merchant.dashboard.html',
  styleUrls: ['../dashboard/dev.dashboard.css',
    '../../../assets/css/argon-dashboard.css',
    "../../../assets/css/nucleo-svg.css",
    "../../../assets/css/nucleo-icons.css",
  ]
})
export class MerchantComponent {
  showNav = false
  merchData: any
  newMerchantForm: any

  userDatas: any


  // check used data e.g. username email phone for user
  usernameUsed = undefined
  emailUsed = false
  phoneUsed = false  
  merchUsed = false
  // type input password
  passwordinputtype = true
  tooglepassword(){
    this.passwordinputtype = !this.passwordinputtype;
  }


  // merchant logo url
  merchantLogoUrl: any

  darkTheme: NgxMaterialTimepickerTheme = {
    container: {bodyBackgroundColor: '#fff',buttonColor: '#07484A '},
    dial: {dialBackgroundColor: '#07484A',},
    clockFace: {clockFaceBackgroundColor: '#07484A',clockHandColor: '#0e8c90',clockFaceTimeInactiveColor: '#fff'}
  };

  file: any;

  constructor(
    public fb: FormBuilder,
    private curdService: CurdApiService,
    private toast : ToastrService,
    private router: Router,
    private devService: DevService,
    private sanitizer: DomSanitizer
  ){
    if(localStorage.getItem('__$DEV__TOKEN__')){
      this.devService.checkValidLoginDev(localStorage.getItem('__$DEV__TOKEN__'))
    }
    
    this.merchantListDat()
    this.reactiveForm()
    this.getAllRegisterdUser()
    this.editMerchReactiveForm()
  }

  deleteMerchant(index : any){
    Swal.fire({
      title: 'Delete Merchant ?',
      text: 'By deleting this merchant with delete all following merchant data.',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#07484A'
    }).then((result) => {
      if(result.isConfirmed){
        this.devService.deleteMerchant(index).subscribe((res: any) => {
          if(res === 1)
            Swal.fire('Success', 'Successfully Delete Merchant', 'success')
          else
          Swal.fire('Error', 'Internal Server Error Please contact developer', 'success')
        })
      }
    })
    
    
  }


  testlog(){
    if(this.newMerchantForm.invalid){
      this.toast.error('Please check your inputed data !', 'Form data cannot be null')
      this.newMerchantForm.markAllAsTouched();
      return 
    }

    this.merchantListDat()
    this.getAllRegisterdUser()
    this.checkusername()
    this.checkEmail()
    this.checkPhone()
    this.checkMerchantName()

    if(this.usernameUsed === false && this.emailUsed === false && this.phoneUsed === false && this.merchUsed === false){
      Swal.fire({
        title: 'Submit New Merchant ?',
        text: 'Make sure all information already correct.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        confirmButtonColor: '#07484A',
        cancelButtonColor: '#0d6efd'
      }).then((result) => {
        if (result.isConfirmed) {
          console.log("submit datas");
          let formData = new FormData();
          formData.set("anyfilesnames", this.file)

          this.curdService.uploadordermerchlogo(formData).subscribe((res: any) => {
            this.merchantLogoUrl = res.resUpload.filePath
            console.log(res.resUpload.filePath);
            
            this.newMerchantForm.value.merchantlogo = this.merchantLogoUrl
            const encryptPassword = CryptoJS.HmacSHA256(this.password.value, environment.keyEncrypt)
            this.newMerchantForm.value.password = CryptoJS.enc.Base64.stringify(encryptPassword)
            
            console.log(this.newMerchantForm.value);
            
            this.curdService.submitNewMerchant(this.newMerchantForm.value).subscribe((dat:any) => {
              if(dat === 1){
                this.toast.success("Success Register New Merchant")
              }
            })
            
          })
        }
      })
  
    } else {
      this.toast.error(`Please Check your inputed value before submit !`);
    }
  }

  tease(event: any){
    this.file = event.target.files[0]
    console.log(this.file);
    
    if(this.file.type != 'image/png' && this.file.type != 'image/jpeg'){
      this.merchantlogo.reset()
      this.file = null
      this.toast.info('following type is jpeg jpg png', 'Please put correct files only !')
    }
    else {
      if(event.target.files[0].size >= 5242880){
        this.merchantlogo.reset()
        this.file = null
        this.toast.info('Please put files size less than 5MB only !')
      }
    }
  }


  noWhitespaceValidator(control: FormControl) {
    const isSpace = (control.value || '').match(/\s/g);
    return isSpace ? {'whitespace': true} : null;
  }

  ngAfterViewInit(){
    
  }

  setShowNav(){
    this.showNav = !this.showNav
  }


  // get all merchant to datatables
  merchantListDat(){
    this.curdService.getAllMerchant().subscribe((res: any) => {
      this.merchData = res
      $(document).ready(function () {
        $('#listmerchant').DataTable().destroy()
        $('#listmerchant').DataTable({
          scrollX: true,
        });
      });
    })
  }

  // gett all registerd usr
  getAllRegisterdUser(){
    this.curdService.getUsersname().subscribe((users:any) => {return this.userDatas = users.payload.datas})
  }

  // Reactive Form areas only
  reactiveForm(){
    this.newMerchantForm = this.fb.group({
      merchantuname: ['', [Validators.required, this.noWhitespaceValidator]],
      merchantname: ['', Validators.required], 
      opentime: ['', Validators.required], 
      closetime: ['', Validators.required], 
      merchantlogo: ['', Validators.required],
      
      fulladdress: ['', Validators.required], 
      city: ['', Validators.required], 
      postcode: ['', Validators.required], 
      phoneaddress: ['', [Validators.required, Validators.pattern('^[0-9]*$')]], 
      note: [''],
     
      username: ['', [Validators.required, Validators.minLength(5), this.noWhitespaceValidator]], 
      password: ['', [Validators.required, this.strongNumber, this.strongUpper,  Validators.minLength(6), this.noWhitespaceValidator]], 
      fullname: ['', Validators.required], 
      email: ['', [Validators.required, this.regexValidemail]], 
      gender: ['', Validators.required], 
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]], 
      position: ['Owner', Validators.required], 
      cardid: ['', Validators.required]
    })
  }

  // Merchant Information get areas only
  get merchantuname() {return this.newMerchantForm.get('merchantuname')}
  get merchantname(){return this.newMerchantForm.get('merchantname')}
  get opentime(){return this.newMerchantForm.get('opentime')}
  get closetime(){return this.newMerchantForm.get('closetime')}
  get merchantlogo(){return this.newMerchantForm.get('merchantlogo')}

  // Merchant Address
  get fulladdress(){return this.newMerchantForm.get('fulladdress')}
  get city(){return this.newMerchantForm.get('city')}
  get postcode(){return this.newMerchantForm.get('postcode')}
  get phoneaddress(){return this.newMerchantForm.get('phoneaddress')}
  get note(){return this.newMerchantForm.get('note')}

  // Merchant Owner User
  get username(){return this.newMerchantForm.get('username')}
  get password(){return this.newMerchantForm.get('password')}
  get fullname(){return this.newMerchantForm.get('fullname')}
  get email(){return this.newMerchantForm.get('email')}
  get gender(){return this.newMerchantForm.get('gender')}
  get phone(){return this.newMerchantForm.get('phone')}
  get position(){return this.newMerchantForm.get('position')}
  get cardid(){return this.newMerchantForm.get('cardid')}


  // Validators areas
  regexValidemail(control: FormControl){
    let isemail = /^[\w-\.+]+@([\w-]+\.)+[\w-]{2,100}$/.test(control.value);
    if (!isemail) {
      return {isemail: true};
    }
    return null;
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

  checkusername(){
    let usedIs: any = false
    this.userDatas.forEach((dat:any) => {
      if(dat.username === this.username.value)
        usedIs = true
    });    
    this.usernameUsed = usedIs
  }

  checkEmail(){
    let usedIs: any = false
    this.userDatas.forEach((dat:any) => {
      if(dat.email === this.email.value)
        usedIs = true
    });
    this.emailUsed = usedIs
  }

  checkPhone(){
    let usedIs: any = false
    this.userDatas.forEach((dat:any) => {
      if(dat.phone === this.phone.value)
        usedIs = true
    });
    this.phoneUsed = usedIs
  }

  checkMerchantName(){
    let usedIs: any = false
    this.merchData.forEach((dat:any) => {
      if(dat.merchdatas.merchantuname === this.newMerchantForm.get('merchantuname').value)
        usedIs = true
    });
    this.merchUsed = usedIs
  }

  signDevOut(){ this.devService.destroyDevSid() }

  // View Merchant details

  // Declaration Edit Merchant
  isViewMerch = false
  selectedMerchId: any = null
  selectedMerchDatas: any
  edMerchantForm: any
  imgMerchLinkTemp: any
  imgLinkedTemp: any
  isImagechages = false

  newmerchUsed = false

  checkUpdatedUsername(){
    let usedIs: any = false
    this.merchData.forEach((dat:any) => {
      if(dat.merchdatas.merchantuname === this.edMerchantForm.get('edmerchuname').value)
        usedIs = true
    });
    this.newmerchUsed = usedIs
  }

  reqViewMerchant(meID: any){
    this.selectedMerchId = meID
    this.isViewMerch = true
    
    this.devService.viewMerchantInfo(meID).subscribe((dat: any) => {
      if(dat.statusCode === '1'){
        console.log("Iamtrying");
        this.imgMerchLinkTemp = this.imgLinkedTemp = dat.data[0].merchantlogo
        this.edMerchantForm.setValue({
          merchantid: `${dat.data[0].merchantid}`,
          addressid: `${dat.data[0].addressid}`,

          edmerchuname: `${dat.data[0].merchantuname}`,
          edmerchname: `${dat.data[0].merchantname}`,
          edmerchdate: `${dat.data[0].datecreated}`, 
          edmerchopen: `${dat.data[0].opentime}`, 
          edmerchclose: `${dat.data[0].closetime}`, 
          edmerchantlogo: '',

          edmerchaddress: `${dat.data[0].fulladdress}`, 
          edmerchcity: `${dat.data[0].city}`, 
          edmerchpostcode: `${dat.data[0].postcode}`, 
          edmerchtcp: `${dat.data[0].phoneAddress}`, 
          edmerchtinfo: `${dat.data[0].note}`,
        })

      } else {
        console.log('Invalidcart');
      }
    })
  }

  // Lines of codes Edit Merchant
  editMerchReactiveForm(){
    this.edMerchantForm = this.fb.group({
      merchantid: ['', [Validators.required]],
      addressid: ['', [Validators.required]],

      edmerchuname: ['', [Validators.required, this.noWhitespaceValidator]],
      edmerchname: ['', Validators.required],
      edmerchdate: ['', Validators.required], 
      edmerchopen: ['', Validators.required], 
      edmerchclose: ['', Validators.required], 
      edmerchantlogo: [''],
      // blm ada logo , validasi cek semuanya!
      edmerchaddress: ['', Validators.required], 
      edmerchcity: ['', Validators.required], 
      edmerchpostcode: ['', Validators.required], 
      edmerchtcp: ['', [Validators.required, Validators.pattern('^[0-9]*$')]], 
      edmerchtinfo: [''],
    })
  }


  resetEditImg(){
    this.edMerchantForm.get('edmerchantlogo').reset()
    this.file = null
    this.imgMerchLinkTemp = this.imgLinkedTemp
  }

  editMerchlogos(event: any){
    this.file = event.target.files[0]
    console.log(this.file);
    
    if(this.file.type != 'image/png' && this.file.type != 'image/jpeg'){
      this.edMerchantForm.get('edmerchantlogo').reset()
      this.file = null
      this.toast.info('following type is jpeg jpg png', 'Please put correct files only !')
    }
    else {
      if(event.target.files[0].size >= 5242880){
        this.edMerchantForm.get('edmerchantlogo').reset()
        this.file = null
        this.toast.info('Please put files size less than 5MB only !')
      }
      console.log(`url: ${URL.createObjectURL(this.file)}`);
      this.imgMerchLinkTemp = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.file))
    }
  }

  submitEditMerchant(){
    if(this.edMerchantForm.invalid || this.newmerchUsed === true){
      this.toast.error('Please check your inputed data !', 'Form data cannot be null')
      this.toast.info('Merchant data has been reset to default')
      this.reqViewMerchant(this.selectedMerchId)
      return 
    }
    // upload image
    let formData = new FormData();
    formData.set("anyfilesnames", this.file)
    if(this.isImagechages === true){
      this.curdService.uploadordermerchlogo(formData).subscribe((res: any) => {
        this.merchantLogoUrl = res.resUpload.filePath
        this.edMerchantForm.value.edmerchantlogo = this.merchantLogoUrl
        // logging file
        console.log(res.resUpload.filePath)
        this.devService.updateMerchanInfo(this.edMerchantForm.value).subscribe((res: any) => {
          if(res.statusCode === '1'){
            Swal.fire('Success', `Successfully Update Merchant Information for Merchant ID: ${this.edMerchantForm.value.merchantid}`, 'success')
          } else {
            Swal.fire('Error', `Internal Server Error`, 'error')
          }
        })
      })
    } else {
      this.devService.updateMerchanInfo(this.edMerchantForm.value).subscribe((res: any) => {
        if(res.statusCode === '1'){
          Swal.fire('Success', `Successfully Update Merchant Information for Merchant ID: ${this.edMerchantForm.value.merchantid}`, 'success')
        } else {
          Swal.fire('Error', `Internal Server Error`, 'error')
        }
      })
    }

  }
}
