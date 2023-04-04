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
          localStorage.removeItem('_____$DevDatas_____')
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

  // developer Get Mechant Produt
  getAllMerchantProduct(){
    return this.http.get(`${this.apiurl}/show/merchant/product/total`)
  }

  getMerchantProductDetails(datas: any){
    return this.http.get(`${this.apiurl}/show/merchant/product/detail/${datas}`)
  }

  getMerchantProductDetailsById(datas: any){
    return this.http.get(`${this.apiurl}/show/merchant/product/details/${datas}`)
  }

  // developer submit new product
  postNewProduct(datas: any){
    return this.http.post(`${this.apiurl}/changes/developer/post/merchant/product`, datas)
  }

  // developer upload product type images merchant
  uploadImagesProductType(datas: any){
    return this.http.post(`${this.apiurl}/changes/developer/post/merchant/product/image`, datas)
  }

  // developer insert product type merchant
  postNewProductType(datas: any){
    return this.http.post(`${this.apiurl}/changes/developer/post/merchant/product/types`, datas)
  }

  // developer insert print color product
  postNewPrintColor(datas: any){
    return this.http.post(`${this.apiurl}/changes/developer/post/merchant/product/color`, datas)
  }

  // developer insert print quality product
  postNewPrintQuality(datas: any){
    return this.http.post(`${this.apiurl}/changes/developer/post/merchant/product/quality`, datas)
  }

  // developer delete product
  deleteProductById(id: any){
    return this.http.delete(`${this.apiurl}/unchanges/developer/post/merchant/product/${id}`)
  }
  
  // developer delete product type
  deleteProductTypeById(id: any){
    return this.http.delete(`${this.apiurl}/unchanges/developer/post/merchant/product/type/${id}`)
  }

  // developer delete print color
  deletePrintColorById(id: any){
    return this.http.delete(`${this.apiurl}/unchanges/developer/post/merchant/product/print/color/${id}`)
  }

  // developer delete print quality
  deletePrintQualityById(id: any){
    return this.http.delete(`${this.apiurl}/unchanges/developer/post/merchant/product/print/quality/${id}`)
  }

}
