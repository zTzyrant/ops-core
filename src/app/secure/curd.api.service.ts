import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CurdApiService {
  datas: any;
  apiurl = environment.apiurl;
  constructor(private http: HttpClient) { }

  // Get All username
  getUsersname(){
    return this.http.get(`${this.apiurl}/datausrname`);
  }

  registercustomer(data: any){
    return this.http.post(`${this.apiurl}/registeruserascustomer`, data);
  }
}
