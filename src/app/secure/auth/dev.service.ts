import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DevService {
  myreturn = false
  apiurl = environment.apiurl;
  constructor(
    private router: Router,
    public http: HttpClient
  ) { }

  checkSessionDeveloper(){
    return this.http.post(`${this.apiurl}/secure/net/check/dev/auth`, {'authdev': localStorage.getItem('__$DEV__TOKEN__')})
  }

  destroyDevSid(){
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
          localStorage.removeItem('__$DEV__TOKEN__')
          return this.router.navigate(['/developer/login'])
        })
      }
    })
  }

  // Dashboard Merchant View Merchant Details by id
  viewMerchantInfo(datas: any){
    return this.http.get(`${this.apiurl}/show-merchant/details/${datas}`)
  }

  // Developer Delete Merchant
  deleteMerchant(datas: any){
    return this.http.post(`${this.apiurl}/unchanges/developer/delete/merchant`, datas)
  }

  // Developer Update Merchant
  updateMerchanInfo(datas: any){
    return this.http.put(`${this.apiurl}/changes/develepor/update/merchant`, datas)
  }
}
