import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DevService {
  myreturn = false
  apiurl = environment.apiurl;
  constructor(
    private router: Router,
    private http: HttpClient
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
          return this.router.navigate(['/developer/login'])
        })
      }
    })
  }
}
