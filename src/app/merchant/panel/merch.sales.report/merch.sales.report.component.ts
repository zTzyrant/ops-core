import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DevService } from 'src/app/secure/auth/dev.service';
import { CurdApiService } from 'src/app/secure/curd.api.service';
import { MerchantApiService } from 'src/app/secure/merchant/merchant.api.service';

@Component({
  selector: 'app-merch.sales.report',
  templateUrl: 'merch.sales.html',
  styleUrls: ['merch.sales.css',
    '../merch.dashboard/merchdashboard.css',
    '../../../../assets/css/argon-dashboard.css',
    "../../../../assets/css/nucleo-svg.css",
    "../../../../assets/css/nucleo-icons.css"
  ]
})
export class MerchSalesReportComponent {
  showNav = false;
  devDatas: any

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
  }
  
  setShowNav(){
    this.showNav = !this.showNav
  }
}
