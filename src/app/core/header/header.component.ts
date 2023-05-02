import { Component } from '@angular/core';
import { CurdApiService } from 'src/app/secure/curd.api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  apilogin = JSON.parse(localStorage.getItem('logindatas')!);
  meUIuser = 0
  public filterTerm!: string;
  chartStatus = false
  chartUser: any
  // log for logged user
  
  constructor(private curdService: CurdApiService){
    if(this.apilogin){
      this.chartUser = this.apilogin.fields[0].userid
      this.curdService.checkloginlegal()
      if(this.apilogin.fields[0].devid){
        this.meUIuser = 1
      } else{
        this.meUIuser = 0
      }
    }
  }

  changeFilter(){
    window.location.href = `/search/${this.filterTerm}`;
  }

  setChartNotif(dat: any){
    this.chartStatus = dat
  }

  signout(){
    Swal.fire({
      title: 'Do you want to signed out?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      confirmButtonColor: '#07484A',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Successfully signed out!', '', 'success').then(() => {
          localStorage.removeItem('logindatas')
          location.reload()
        })
        
      }
    })

    
  }

}
