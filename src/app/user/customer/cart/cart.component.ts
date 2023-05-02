import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CurdApiService } from 'src/app/secure/curd.api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  templateUrl: 'cart.html',
  styleUrls: ['cart.css']
})

export class CartComponent {
  apilogin = JSON.parse(localStorage.getItem('logindatas')!);
  cartProd: any
  totalToPay = 0
  arrayCart: any = []
  
  constructor(
    private route: Router,
    public fb: FormBuilder,
    private curdService: CurdApiService,
    private toast : ToastrService,
    public sanitizer: DomSanitizer
  ){
    if(this.apilogin){
      this.getAllCartFromInside()
    }
  }

  vierpdf(dat: any){
    let dast = this.sanitizer.bypassSecurityTrustUrl(dat)

    return dast
  }

  deleteOrder(id: any, indexArr: any){
    

    Swal.fire({
      title: 'Delete order data ?',
      text: 'Are you sure want to delete this order data ?',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#07484A'
    }).then((result) => {
      this.curdService.deleteOrderFromCart({orderid: id}).subscribe((res: any) => {
        if(res === 1){
          this.arrayCart.splice(this.arrayCart.findIndex((x: any) => x.orderid === id), 1);
          this.totalToPay = this.totalToPay - this.cartProd.fields[indexArr].totalcost

          this.toast.success('Order deleted')
          this.cartProd = null
          this.getAllCartFromInside()
        }
        else
          this.toast.success('Something error on server side')
      })
    })
  }

  getAllCartFromInside(){
    this.curdService.getCustomerCart(this.apilogin.fields[0].consid).subscribe((res: any) => {
      this.cartProd = res
      console.log(res);
    })
  }

  addToCartCheckout(id: any, indexArr: any){
    if(this.arrayCart.findIndex((x: any) => x.orderid === id) < 0){
      this.totalToPay = this.totalToPay + this.cartProd.fields[indexArr].totalcost
      this.arrayCart.push(this.cartProd.fields[indexArr])
    } else {
      this.arrayCart.splice(this.arrayCart.findIndex((x: any) => x.orderid === id), 1);
      this.totalToPay = this.totalToPay - this.cartProd.fields[indexArr].totalcost
    }
    console.log(this.arrayCart);
    
  }

  submitOrder(){
    this.curdService.setOrderDataUser({ totalPayment: this.totalToPay,  cartOrder: this.arrayCart})
    this.route.navigateByUrl('/cart/shipment')
  }
}
