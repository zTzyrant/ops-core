import { Component } from '@angular/core';
import 'datatables.net'
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

  ngOnInit(){
    $(document).ready(function () {
        $('#example').DataTable({scrollX: true});
    });
  }

  setShowNav(){
    this.showNav = !this.showNav
  }
}
