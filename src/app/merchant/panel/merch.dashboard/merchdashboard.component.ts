import { Component } from '@angular/core';
import { Router } from '@angular/router';
import 'datatables.net'
import { ToastrService } from 'ngx-toastr';
import { DevService } from 'src/app/secure/auth/dev.service';
import { MerchantApiService } from 'src/app/secure/merchant/merchant.api.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './merchdashboard.html',
  styleUrls: ['./merchdashboard.css',
    '../../../../assets/css/argon-dashboard.css',
    "../../../../assets/css/nucleo-svg.css",
    "../../../../assets/css/nucleo-icons.css",
  ]
})

export class MerchDashboardComponent {
  showNav = false

  constructor (
    private merchantApi: MerchantApiService,
    private router: Router,
    private toast : ToastrService,
  ) { }

  ngOnInit(){
    if(localStorage.getItem('$admin@merchant')){
      this.merchantApi.checkValidLoginMerchant(localStorage.getItem('$admin@merchant'))
    }
    $(document).ready(function () {
        $('#example').DataTable({scrollX: true});
    });
  }
// blm login terus masih banyak kurang
  setShowNav(){
    this.showNav = !this.showNav
  }

  signDevOut(){ this.merchantApi.destroyMerchantSid() }
}
