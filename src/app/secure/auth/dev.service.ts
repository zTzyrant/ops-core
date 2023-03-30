import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class DevService {
  myreturn = false
  apiurl = environment.apiurl;
  constructor(
    private router: Router,
    public http: HttpClient,
    private toast : ToastrService,
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
    return this.http.put(`${this.apiurl}/changes/developer/update/merchant`, datas)
  }

  // validate login
  checkValidLoginDev(datas: any){
    this.checkSessionDeveloper().subscribe((result: any) => {
      console.log(result);
      
      if(result.statQuo !== '1'){
        this.router.navigate(['../developer/login'])
        localStorage.removeItem('__$DEV__TOKEN__')
        this.toast.error('Invalid Login Token', 'Please Login Again')
      } else {
        localStorage.setItem('_____$DevDatas_____', JSON.stringify(result.datax[0]))
        console.log(localStorage.getItem('_____$DevDatas_____'));
        
      }
    })
    
  }

  // developer submit new admin
  postNewAdmin(datas: any){
    return this.http.post(`${this.apiurl}/changes/developer/post/merchant/admin`, datas)
  }

  // developer delete admin
  deleteMerchantAdmin(datas: any){
    return this.http.post(`${this.apiurl}/unchanges/developer/delete/merchant/admin`, datas)
  }

  // developer update admin
  updateMerchantAdmin(datas: any){
    return this.http.put(`${this.apiurl}/changes/developer/update/merchant/admin`, datas)
  }

  // Developer Get Mechant Produt
  getAllMerchantProduct(){
    return this.http.get(`${this.apiurl}/show/merchant/product/total`)
  }

  getMerchantProductDetails(datas: any){
    return this.http.get(`${this.apiurl}/show/merchant/product/detail/${datas}`)
  }
}
