import { Component } from '@angular/core';
import { Router } from '@angular/router';
import 'datatables.net'
import { ToastrService } from 'ngx-toastr';
import { DevService } from 'src/app/secure/auth/dev.service';
import { MerchantApiService } from 'src/app/secure/merchant/merchant.api.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './merchdashboard.html',
  styleUrls: ['./merchdashboard.css',
    '../../../../assets/css/argon-dashboard.css',
    "../../../../assets/css/nucleo-svg.css",
    "../../../../assets/css/nucleo-icons.css",
  ]
})

export class MerchDashboardComponent {
  showNav = false
  devDatas: any

  constructor (
    private merchantApi: MerchantApiService,
    private router: Router,
    private toast : ToastrService,
  ) { }

  ngOnInit(){
    if(localStorage.getItem('$admin@merchant')){
      this.merchantApi.checkValidLoginMerchant(localStorage.getItem('$admin@merchant'))
      this.devDatas = JSON.parse(localStorage.getItem('_____$AdminDatas_____')!)
      this.get_todays_datas()
    }
    $(document).ready(function () {
        $('#example').DataTable({scrollX: true});
    });
  }
  setShowNav(){
    this.showNav = !this.showNav
  }

  signDevOut(){ this.merchantApi.destroyMerchantSid() }

  total_income_today: any
  total_sales_product_today: any
  collection_info_orders_today: any
  orders_today: any
  
  get_todays_datas(){
    this.merchantApi.get_todays_datas(this.devDatas.merchantid).subscribe((res: any) => {
      if(res.statQuo === '1'){
        this.total_income_today = res.total_income_today.total_order_costs
        this.total_sales_product_today = res.total_sales_product_today.total_sales_product_today
        this.collection_info_orders_today = res.collection_info_orders_today
        this.orders_today = res.orders_today
        $(document).ready(function () {
          $('#listofsales').DataTable().destroy()
          $('#listofsales').DataTable({
            scrollX: true,
          });
          $('#listoforders_done').DataTable().destroy()
          $('#listoforders_done').DataTable({
            scrollX: true,
          });
        });
      } else {
        this.toast.error('Internal server error')
      }
      
    })
  }
}
