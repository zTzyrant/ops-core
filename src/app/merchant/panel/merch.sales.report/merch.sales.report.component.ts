import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DevService } from 'src/app/secure/auth/dev.service';
import { CurdApiService } from 'src/app/secure/curd.api.service';
import { MerchantApiService } from 'src/app/secure/merchant/merchant.api.service';
import Swal from 'sweetalert2';

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
  devDatas: any;
  get_all_product_costs: any
  get_total_order_costs: any
  get_total_products: any
  get_total_sold_product_wquantity: any
  get_orders_with_costs: any

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
      this.get_sales_report()
    }
  }

  get_sales_report(){
    this.merchantApi.get_sales_report(this.devDatas.merchantid  ).subscribe((res: any) => {
      if(res.statQuo === '1'){
        this.get_all_product_costs = res.f1
        this.get_total_order_costs = res.f2
        this.get_total_products = res.f3
        this.get_total_sold_product_wquantity = res.f4
        this.get_orders_with_costs = res.get_orders_with_costs
      } else{
        this.toast.error('Internal Server Error')
      }
      $(document).ready(function () {
        $('#listofsales').DataTable().destroy()
        $('#listofsales').DataTable({
          scrollX: true,
        });
      });
    })
  }

  setShowNav(){
    this.showNav = !this.showNav
  }

  signDevOut(){ this.merchantApi.destroyMerchantSid() }
}
