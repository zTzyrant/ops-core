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
  filterProd! : string
  consNotif = false
  orderDataUser: any
  constructor(private http: HttpClient) { }

  setNotif(dat: any){
    this.consNotif = false
  }

  getNotif(){
    return this.consNotif
  }

  getFilterProd(){    
    return this.filterProd
  }

  setFilterProd(data: any){
    console.log('seted');
    this.filterProd = data
  }

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

  requestRestartPassword(datas: any){
    return this.http.get(`${this.apiurl}/forgetpassword?email=${datas}`)
  }

  checkloginlegal(){
    if(localStorage.getItem('logindatas') != null){
      let stringJson = localStorage.getItem('logindatas')
      let jsonData = JSON.parse(stringJson!)
      console.log(jsonData);
      
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

  checkSaltTokenEmail(datas: any, token: any){
    return this.http.get(`${this.apiurl}/checkToken?email=${datas}&salt=${token}`)
  }

  requestUpdateConsumerPassword(email: any, token: any, newPassword: any){
    return this.http.get(`${this.apiurl}/updatePassowrd?email=${email}&salt=${token}&newpassword=${newPassword}`)
  }

  reqUpdateConsumerAccount(body: any){
    return this.http.post(`${this.apiurl}/updateCustomer`, body)
  }

  updateSessionConsumer(datas: any){
    this.http.post(`${this.apiurl}/getconsumerdatas`, datas).subscribe(response => {
      let newDatas = response      
      localStorage.setItem('logindatas', JSON.stringify(newDatas));
    })   
  }

  uploadorderpdf(datas: any){
    return this.http.post(`${this.apiurl}/uploadorderpdf`, datas);
  }

  checkpdfpages(datas: any){
    return this.http.post(`${this.apiurl}/calcpages`, datas);
  }

  // retrieve all the products which are registered into the system
  getAllOpsProduct(){
    return this.http.get(`${this.apiurl}/ops-prod`)
  }

  getProductByCity(data: any){
    return this.http.get(`${this.apiurl}/ops-prod/city/${data}`)
  }

  getProductByCategory(data: any){
    return this.http.get(`${this.apiurl}/ops-prod/category/${data}`)
  }

  getProductById(data: any){
    return this.http.get(`${this.apiurl}/ops-prod/${data}`)
  }

  getAllMerchant(){
    return this.http.get(`${this.apiurl}/show-merchant`)
  }

  uploadordermerchlogo(datas: any){
    return this.http.post(`${this.apiurl}/uploadlogomerchant`, datas);
  }

  submitNewMerchant(datas: any){
    return this.http.post(`${this.apiurl}/registermerchant`, datas)
  }

  getalladminprinting(datas: any){
    return this.http.get(`${this.apiurl}/get-merchantadmin/${datas}`)
  }

  requestDEVlogin(datas: any){
    return this.http.post(`${this.apiurl}/secure/net/login`, datas)
  }
  
  getAllCategoryProd(){
    return this.http.get(`${this.apiurl}/product/category`)
  }

  getAllLocationProd(){
    return this.http.get(`${this.apiurl}/product/location`)
  }

  saveOrderToCart(datas: any){
    return this.http.post(`${this.apiurl}/save/order/to/cart`, datas)
  }

  deleteOrderFromCart(datas: any){
    return this.http.post(`${this.apiurl}/delete/order/from/cart`, datas)
  }

  getCustomerCart(datas: any){
    return this.http.get(`${this.apiurl}/customer/view/cart/${datas}`)
  }

  setOrderDataUser(datas: any){
    this.orderDataUser = datas
  }

  getOrderDataUser(){
    return this.orderDataUser
  }

  insertNewAddress(datas: any){
    return this.http.post(`${this.apiurl}/customer/insert/address`, datas)
  }

  getAllAddress(datas: any){
    return this.http.get(`${this.apiurl}/customer/view/address/${datas}`)
  }

  getTest(){
    return this.http.get(`https://api.github.com/users?per_page=10`)
  }
}
