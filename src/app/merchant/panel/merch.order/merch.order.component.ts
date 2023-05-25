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
  selector: 'app-merch.order',
  templateUrl: 'merch.order.html',
  styleUrls: ['merch.order.css',
    '../merch.dashboard/merchdashboard.css',
    '../../../../assets/css/argon-dashboard.css',
    "../../../../assets/css/nucleo-svg.css",
    "../../../../assets/css/nucleo-icons.css"
  ],
})
export class MerchOrderComponent {
  showNav = false;
  devDatas: any;
  orderDatas_progress: any = []
  orderDatas_done: any = []
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
      this.get_orders_datas()
    }
    this.update_order_form()
  }

  orderDatas: any
  get_orders_datas(){
    this.orderDatas_progress = []
    this.orderDatas_done = []
    this.merchantApi.get_orders_datas(this.devDatas.merchantid).subscribe((res: any) => {
      if(res.statusQuo === '1'){
        this.orderDatas = res
        this.orderDatas.orders_datas.forEach((e: any) => {
          if(e.orderStatus === 'Done'){
            this.orderDatas_done.push(e)
          } else if (e.orderStatus === 'Waiting' || e.orderStatus === 'On Process') {
            this.orderDatas_progress.push(e) 
          }
        });
      }
      

      $(document).ready(function () {
        $('#listoforders').DataTable().destroy()
        $('#listoforders').DataTable({
          scrollX: true,
        });
        $('#listoforders_done').DataTable().destroy()
        $('#listoforders_done').DataTable({
          scrollX: true,
        });
      });
    })  
  }

  setShowNav(){
    this.showNav = !this.showNav
  }

  signDevOut(){ this.merchantApi.destroyMerchantSid() }

  view_order_data: any
  view_order_details(dat: any){
    this.view_order_data = dat
    this.form_update_order.patchValue({
      order_id: this.view_order_data.orderid,
      order_status: this.view_order_data.orderStatus,
      shipping_receipt: this.view_order_data.shippingreceipt
    })
  }

  form_update_order: any
  update_order_form(){
    this.form_update_order = this.fb.group({
      order_id: ['', Validators.required],
      order_status: ['', Validators.required],
      shipping_receipt: ['', Validators.required]
    })
  }

  perform_update_order(dat: any){
    if(this.form_update_order.invalid){
      this.toast.error('Invalid Input !')
      this.toast.error('Please Check Your inputed data !')
      this.toast.info('Order data set to default')
      this.view_order_details(dat)
      return
    }

    Swal.fire({
      title: 'Update Order?',
      text: "You will update this order data!",
      icon: 'warning',
      confirmButtonColor: '#07484A',
      showCancelButton: true,
      confirmButtonText: 'Update'
    }).then((result) => {
      if (result.isConfirmed) {
        this.merchantApi.update_order_data(this.form_update_order.value).subscribe((res: any) => {
          if(res.statusQuo === '1'){
            this.toast.success('Order Updated Successfully !')
            this.get_orders_datas()
          } else {
            this.toast.error('Something error !', `Error ${res.statusQuo}`)
          }
        })
      }
    })

  }

}
