import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CurdApiService } from 'src/app/secure/curd.api.service';

@Component({
  selector: 'app-payment',
  templateUrl: 'payment.html',
  styleUrls: ['payment.css']
})
export class PaymentComponent {

  payment_datas: any
  orders_datas: any
  transaction_datas: any
  viewTransactionSection = false
  responese_midtrans: any
  payment_code: any

  constructor(
    private route: ActivatedRoute,
    public fb: FormBuilder,
    public curdService: CurdApiService,
    private toast : ToastrService,
    public sanitizer: DomSanitizer
  ) { }

  get_transaction_datas(){
    this.viewTransactionSection = false
    this.curdService.get_payment_status(this.route.snapshot.params['id']).subscribe((res: any) => {
      if(res.statQuo === '1'){
        this.payment_datas = res.midtrans_payments
        this.orders_datas = res.orderData
        this.transaction_datas = res.transaction_data
        this.viewTransactionSection = true
        this.responese_midtrans = res.responese_midtrans
        if(res.responese_midtrans.payment_type === 'cstore'){
          this.payment_code = {pay_type: res.responese_midtrans.store, codes: res.responese_midtrans.payment_code}
        } else {
          this.payment_code = {pay_type: res.responese_midtrans.va_numbers[0].bank + " Virtual Account", codes: res.responese_midtrans.va_numbers[0].va_number}
        }
      }
    })
  }

  ngOnInit(){
    if(this.route.snapshot.params['id']){
      this.get_transaction_datas()
    } else {
      location.href = '/'
    }
  }

  toUpperCase(text: any){
    return text.toUpperCase()
  }
}
