import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CurdApiService } from 'src/app/secure/curd.api.service';

@Component({
  selector: 'app-orderhistory',
  templateUrl: 'odreshistory.html',
  styleUrls: [ 'odreshistory.css'
  ]
})
export class OrderhistoryComponent {
  orders_datas: any
  transaction_datas: any
  apilogin = JSON.parse(localStorage.getItem('logindatas')!);
  p: number = 1;
  constructor(
    private route: Router,
    public fb: FormBuilder,
    private curdService: CurdApiService,
    private toast : ToastrService,
    public sanitizer: DomSanitizer
  ){
    if(this.apilogin){
      this.get_orders()
    }
  }

  get_orders(){
    this.curdService.get_order_history(this.apilogin.fields[0].consid).subscribe((res: any) => {
      if(res.statusQuo === '1'){
        this.orders_datas = res.result
      }
    })
  }

  directme(transaction_id: any){
    this.route.navigateByUrl(`/shop/payment/${transaction_id}`)
  }
} 
