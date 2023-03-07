import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DevService } from 'src/app/secure/auth/dev.service';
import { CurdApiService } from 'src/app/secure/curd.api.service';

@Component({
  selector: 'app-adminprinting',
  templateUrl: './dev.adminprinting.dashboard.html',
  styleUrls: ['../dashboard/dev.dashboard.css',
    '../../../assets/css/argon-dashboard.css',
    "../../../assets/css/nucleo-svg.css",
    "../../../assets/css/nucleo-icons.css",
  ]
})
export class AdminprintingComponent {
  showNav = false
  merchData: any
  merchAdminDatas: any
  merchSelected = false
  selectedId: any

  @ViewChild('selectedmerch') selectedmerch!: ElementRef;

  constructor(
    public fb: FormBuilder,
    private curdService: CurdApiService,
    private toast : ToastrService,
    private router: Router,
    private devService: DevService
  ){
    if(localStorage.getItem('__$DEV__TOKEN__')){
      this.devService.checkSessionDeveloper().subscribe((result: any) => {
        console.log(result)
        if(result === 1)
          this.router.navigate(['../developer/dashboard'])
        else {
          localStorage.removeItem('__$DEV__TOKEN__')
          this.toast.error('Invalid Login Token', 'Please Login Again')  
        }
      }) 
    }
    this.merchantListDat()
  }
  
  setShowNav(){
    this.showNav = !this.showNav
  }

  signDevOut(){ this.devService.destroyDevSid() }

  // get all merchant to datatables
  merchantListDat(){
    this.curdService.getAllMerchant().subscribe(res => {
      this.merchData = res
    })
  }

  tesae(){
    this.merchSelected = false
    if(this.getSelectedMerchant() > -1) {
      this.curdService.getalladminprinting(this.getSelectedMerchant()).subscribe((datas:any) => {
        if(datas.length > 0){
          console.log(datas);
          this.merchAdminDatas = datas
          this.merchSelected = true
          $(document).ready(function () {
            $('#listmerchantadmin').DataTable().destroy()
            $('#listmerchantadmin').DataTable({
              scrollX: true,
            });
          });
        } else {
          this.toast.info("This Merchant doesn't have any Admin Printing !")
        }
      })
    }
  }



  getSelectedMerchant(){
    return this.selectedmerch.nativeElement.value
  }

  getSelecetedIndex(){
    return this.selectedmerch.nativeElement.selectedIndex - 1
  }
}
