import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

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

  logincustomer(datas: any){
    return this.http.post(`${this.apiurl}/logincustomer`, datas)
  }

  checkloginlegal(){
    if(localStorage.getItem('logindatas') != null){
      let stringJson = localStorage.getItem('logindatas')
      let jsonData = JSON.parse(stringJson!)
      let getuname = jsonData.fields
      let decryptSession = CryptoJS.HmacSHA256(getuname[0].username, environment.keyEncrypt)
      let baseDecryptSession = CryptoJS.enc.Base64.stringify(decryptSession)
      if(jsonData.keySession != baseDecryptSession){
        localStorage.removeItem('logindatas')
        location.reload()
      }
    }
  }
  
  encryptPassword(data: any){
    data = CryptoJS.HmacSHA256(data, environment.keyEncrypt)
    data = CryptoJS.enc.Base64.stringify(data)
    return data
  }
}
