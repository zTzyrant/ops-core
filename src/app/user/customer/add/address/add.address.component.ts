import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DevService } from 'src/app/secure/auth/dev.service';
import { CurdApiService } from 'src/app/secure/curd.api.service';

@Component({
  selector: 'app-AddAddress',
  templateUrl: 'addaddress.html',
  styles: [
  ]
  
})
export class AddAddressComponent {
  insertAddressForm: any
  apilogin = JSON.parse(localStorage.getItem('logindatas')!);

  @Output("getAllAddress") getAllAddress: EventEmitter<any> = new EventEmitter();

  constructor(
    public fb: FormBuilder,
    private curdService: CurdApiService,
    private toast : ToastrService,
    private router: Router,
    private devService: DevService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(){
    this.createFormAddAddress()
    if(this.apilogin){
      this.insertAddressForm.get('userid').setValue(this.apilogin.fields[0].userid)
    }
  }

  createFormAddAddress(){
    this.insertAddressForm = this.fb.group({
      userid: ['', Validators.required],
      fulladdress: ['', Validators.required], 
      city: ['', Validators.required], 
      postcode: ['', Validators.required], 
      phoneaddress: ['', [Validators.required, Validators.pattern('^[0-9]*$')]], 
      note: [''],
    })
  }

  insertNewAddress(){
    if(this.insertAddressForm.invalid) {
      this.insertAddressForm.markAllAsTouched()
      this.toast.error('Please check your inputed data !', 'Form data cannot be null')
      return
    }

    this.curdService.insertNewAddress(this.insertAddressForm.value).subscribe((res: any) => {
      if(res === 1){
        this.toast.success('Address has been added !', 'Address has been added')
        this.getAllAddress.emit()
        this.insertAddressForm.reset()
      } else {
        this.toast.error('Internal Server Error', 'Address has not been added')
      }
    })

  }
}
