import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class MerchantApiService {
  apiurl = environment.apiurl;
  constructor(
    private router: Router,
    public http: HttpClient,
    private toast : ToastrService,
  ) { }

  requestMerchantlogin(datas: any){
    return this.http.post(`${this.apiurl}/secure/merchant/login`, datas)
  }

  checkSessionMerchant(){
    return this.http.post(`${this.apiurl}/secure/merchant/check/auth`, {'authmerch': localStorage.getItem('$admin@merchant')})
  }

  // validate login
  checkValidLoginMerchant(datas: any){
    this.checkSessionMerchant().subscribe((result: any) => {
      console.log(result);
      if(result.statQuo !== '1'){
        this.router.navigate(['/merchant/admin/login'])
        localStorage.removeItem('$admin@merchant')
        localStorage.removeItem('_____$AdminDatas_____')
        this.toast.error('Invalid Login Token', 'Please Login Again')
      } else {
        localStorage.setItem('_____$AdminDatas_____', JSON.stringify(result.datax[0]))
      }
    }) 
  }

  // destroy login session
  destroyMerchantSid(){
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be signed out!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#07484A',
      confirmButtonText: 'Signed me out'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Awww', 'Successfully signed out', 'success').then(() => {
          localStorage.removeItem('$admin@merchant')
          localStorage.removeItem('_____$AdminDatas_____')
          return this.router.navigate(['/merchant/admin/login'])
        })
      }
    })
  }
  
  get_orders_datas(id: any){
    return this.http.get(`${this.apiurl}/secure/merchant/view/orders/${id}`)
  }

  update_order_data(datas: any){
    return this.http.post(`${this.apiurl}/secure/merchant/update/order`, datas)
  }

  get_sales_report(id: any){
    return this.http.get(`${this.apiurl}/secure/merchant/sales/report/${id}`)
  }

  get_todays_datas(id: any){
    return this.http.get(`${this.apiurl}/secure/merchant/income/today/${id}`)
  }

}
