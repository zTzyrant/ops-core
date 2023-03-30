import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DevService } from 'src/app/secure/auth/dev.service';
import { CurdApiService } from 'src/app/secure/curd.api.service';

@Component({
  selector: 'app-merchantproduct',
  templateUrl: './dev.merchantproduct.dashboard.html',
  styleUrls: ['../dashboard/dev.dashboard.css',
    '../../../assets/css/argon-dashboard.css',
    "../../../assets/css/nucleo-svg.css",
    "../../../assets/css/nucleo-icons.css",
  ]
})
export class MerchantproductComponent {
  showNav = false
  arras: string[]= []
  testform:any
  devDatas: any
  merchData: any
  merchSelected = false
  touchedSelected: any

  productSelected: any

  constructor(
    public fb: FormBuilder,
    private curdService: CurdApiService,
    private toast : ToastrService,
    private router: Router,
    private devService: DevService
  ){
    if(localStorage.getItem('__$DEV__TOKEN__')){
      this.devService.checkValidLoginDev(localStorage.getItem('__$DEV__TOKEN__'))
      this.devDatas = JSON.parse(localStorage.getItem('_____$DevDatas_____')!)
    }
    this.testform = this.fb.group({
      goekbong: ['']
    })
    this.merchantListDat()
  }

  signDevOut(){ this.devService.destroyDevSid() }

  // get all merchant to datatables
  merchantListDat(){
    this.devService.getAllMerchantProduct().subscribe(res => {      
      this.merchData = res
    })
  }

  selectedMerchGoods(event: any){
    this.merchSelected = true
    this.touchedSelected = event.target.value
    // this.newAdminForm.get('merchantid').setValue(event.target.value)
    // this.editAdminForm.get('merchantid').setValue(event.target.value)
    // this.generateAdminTables(event.target.value)
    this.getProduct(event.target.value)
  }

  getProduct(idMerchant: any){
    this.prodSelected = false
    this.devService.getMerchantProductDetails(idMerchant).subscribe((res: any) => {
      this.productSelected = res
    })
  }

  selectedProductIndex: any
  prodSelected = false
  prodDetails: any
  selectProduct(event: any){
    this.selectedProductIndex = event.target.value
    this.prodSelected = true
    $(document).ready(function () {
      $('#listPaper').DataTable().destroy()
      $('#listColor').DataTable().destroy()
      $('#listQuality').DataTable().destroy()

      $('#listPaper').DataTable({
        scrollX: true,
        pageLength: 5,
        lengthChange: false
      });
      $('#listColor').DataTable({
        scrollX: true,
        pageLength: 5,
        lengthChange: false,
      });
      $('#listQuality').DataTable({
        scrollX: true,
        pageLength: 5,
        lengthChange: false,
      });
    })
  }

  tease(){
    console.log(this.testform.value);
    let addarray = true
    this.arras.forEach(datas => {
      if(datas === this.testform.value)
        addarray = false
    });
    if(addarray === true)
      this.arras.push(this.testform.value)
    else
      this.toast.error("Please Input Different Value")
  }

  teaseq(){
    console.log(this.arras);
    
  }

  get goekbong(){
    return this.testform.get('goekbong')
  }
  setShowNav(){
    this.showNav = !this.showNav
  } 
}
