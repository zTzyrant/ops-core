import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DevService } from 'src/app/secure/auth/dev.service';
import { CurdApiService } from 'src/app/secure/curd.api.service';

@Component({
  selector: 'app-merchantproduct',
  templateUrl: './dev.merchantproduct.dashboard.html',
  styleUrls: ['../dashboard/dev.dashboard.css',
    '../../../assets/css/argon-dashboard.css',
    "../../../assets/css/nucleo-svg.css",
    "../../../assets/css/nucleo-icons.css",
  ]
})
export class MerchantproductComponent {
  showNav = false
  arras: string[]= []
  testform:any

  constructor(
    public fb: FormBuilder,
    private curdService: CurdApiService,
    private toast : ToastrService,
    private router: Router,
    private devService: DevService
  ){
    if(localStorage.getItem('__$DEV__TOKEN__')){
      this.devService.checkSessionDeveloper().subscribe((result: any) => {
        if(result !== 1){
          this.router.navigate(['../developer/login'])
          localStorage.removeItem('__$DEV__TOKEN__')
          this.toast.error('Invalid Login Token', 'Please Login Again')  
        }
      }) 
    }
    this.testform = this.fb.group({
      goekbong: ['']
    })
  }

  signDevOut(){ this.devService.destroyDevSid() }

  tease(){
    console.log(this.testform.value);
    let addarray = true
    this.arras.forEach(datas => {
      if(datas === this.testform.value)
        addarray = false
    });
    if(addarray === true)
      this.arras.push(this.testform.value)
    else
      this.toast.error("Please Input Different Value")
  }

  teaseq(){
    console.log(this.arras);
    
  }

  get goekbong(){
    return this.testform.get('goekbong')
  }
  setShowNav(){
    this.showNav = !this.showNav
  }
}
