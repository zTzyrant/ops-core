import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CurdApiService } from 'src/app/secure/curd.api.service';

@Component({
  selector: 'app-shipment',
  templateUrl: 'shipment.html',
  styleUrls: ['shipment.css']
})

export class ShipmentComponent {
  apilogin = JSON.parse(localStorage.getItem('logindatas')!);
  state$: any
  collectionAddress: any
  differentMerchant: any = []
  afterCart: any = []
  trueCart = false
  totalCostShipping = 0
  shippingTo: any = []

  constructor(
    private route: Router,
    public fb: FormBuilder,
    public curdService: CurdApiService,
    private toast : ToastrService,
    public sanitizer: DomSanitizer
  ){
    this.createFormTransaction()
    if(this.apilogin){
      this.getAllAddress()
      this.insertTransactionForm.get('userid').setValue(this.apilogin.fields[0].userid)
    }
  }

  ngOnInit(){
    if(!this.curdService.getOrderDataUser()){
      this.route.navigate(['/cart']);
    } else {
      console.log(this.curdService.getOrderDataUser());
      this.trueCart = true
      this.totalCostShipping = this.curdService.getOrderDataUser().totalPayment 
      for (let xr = 0; xr < this.curdService.getOrderDataUser().cartOrder.length; xr++) {
        if(this.differentMerchant.length > 0){
          let pushMaster = true
          for (let rx = 0; rx < this.differentMerchant.length; rx++) {
            if(this.curdService.getOrderDataUser().cartOrder[xr].merchantid === this.differentMerchant[rx]){
              pushMaster = false
            } 
          }
          if(pushMaster){
            this.differentMerchant.push(this.curdService.getOrderDataUser().cartOrder[xr].merchantid)
            this.shippingTo.push(this.curdService.getOrderDataUser().cartOrder[xr])
          }
        } else {
          this.differentMerchant.push(this.curdService.getOrderDataUser().cartOrder[xr].merchantid)
          this.shippingTo.push(this.curdService.getOrderDataUser().cartOrder[xr])
        }
      }

      for (let rx = 0; rx < this.differentMerchant.length; rx++) {
        let tempArr = []
        for (let xr = 0; xr < this.curdService.getOrderDataUser().cartOrder.length; xr++) {
          if(this.curdService.getOrderDataUser().cartOrder[xr].merchantid === this.differentMerchant[rx]){
            tempArr.push(this.curdService.getOrderDataUser().cartOrder[xr])
          }
        }
        this.afterCart.push(tempArr)
      }
      console.log({after: this.afterCart, shipping: this.shippingTo});
      
    } 
  }

  getAllAddress(){
    this.collectionAddress = undefined
    this.curdService.getAllAddress(this.apilogin.fields[0].userid).subscribe((res: any) => {
      this.collectionAddress = res
    })
  }

  deliverOption = '1'
  setDeliverOption(event: any){
    this.deliverOption = event.target.value
    console.log(event.target.value);
    
  }

  logAddress(){
    console.log(this.collectionAddress);
    
  }

  insertTransactionForm: any
  createFormTransaction(){
    this.insertTransactionForm = this.fb.group({
      userid: ['', Validators.required],
      paymentradio: ['bcava', Validators.required], 
    })
  }

  geko(){
    console.log(this.insertTransactionForm.value);
    
    console.log(this.differentMerchant);


  }
  
}
