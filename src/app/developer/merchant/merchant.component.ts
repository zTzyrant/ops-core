import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CurdApiService } from 'src/app/secure/curd.api.service';

@Component({
  selector: 'app-merchant',
  templateUrl: './dev.merchant.dashboard.html',
  styleUrls: ['../dashboard/dev.dashboard.css',
    '../../../assets/css/argon-dashboard.css',
    "../../../assets/css/nucleo-svg.css",
    "../../../assets/css/nucleo-icons.css",
  ]
})
export class MerchantComponent {
  showNav = false
  merchData: any

  constructor(
    public fb: FormBuilder,
    private curdService: CurdApiService,
    private toast : ToastrService
  ){
    this.curdService.getAllMerchant().subscribe(res => {
      this.merchData = res
      console.log(this.merchData);
      $(document).ready(function () {
        $('#listmerchant').DataTable({scrollX: true});
      });
    })
  }

  ngAfterViewInit(){
    
  }

  setShowNav(){
    this.showNav = !this.showNav
  }
}
