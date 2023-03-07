import { Component } from '@angular/core';
import { Router } from '@angular/router';
import 'datatables.net'
import { ToastrService } from 'ngx-toastr';
import { DevService } from 'src/app/secure/auth/dev.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dev.dashboard.html',
  styleUrls: ['./dev.dashboard.css',
    '../../../assets/css/argon-dashboard.css',
    "../../../assets/css/nucleo-svg.css",
    "../../../assets/css/nucleo-icons.css",
  ]
})
export class DashboardComponent {
  showNav = false

  constructor (
    private devService: DevService,
    private router: Router,
    private toast : ToastrService,
  ) { }

  ngOnInit(){
    if(localStorage.getItem('__$DEV__TOKEN__')){
      this.devService.checkSessionDeveloper().subscribe((result: any) => {
        if(result !== 1){
          this.router.navigate(['../developer/login'])
          localStorage.removeItem('__$DEV__TOKEN__')
          this.toast.error('Invalid Login Token', 'Please Login Again')  
        }
      })
    }
    $(document).ready(function () {
        $('#example').DataTable({scrollX: true});
    });
  }

  setShowNav(){
    this.showNav = !this.showNav
  }

  signDevOut(){ this.devService.destroyDevSid() }
}
