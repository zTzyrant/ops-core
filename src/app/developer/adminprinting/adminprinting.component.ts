import { Component } from '@angular/core';

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

  setShowNav(){
    this.showNav = !this.showNav
  }
}
