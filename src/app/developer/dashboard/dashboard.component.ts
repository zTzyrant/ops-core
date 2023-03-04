import { Component } from '@angular/core';
import 'datatables.net'
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
  ) { }

  ngOnInit(){
    $(document).ready(function () {
        $('#example').DataTable({scrollX: true});
    });
  }

  setShowNav(){
    this.showNav = !this.showNav
  }

  signDevOut(){ this.devService.destroyDevSid() }
}
