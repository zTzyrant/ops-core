import { Component, ElementRef, ViewChild } from '@angular/core';
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
      this.insertTransactionForm.get('email').setValue(this.apilogin.fields[0].email)
      this.insertTransactionForm.get('full_name').setValue(this.apilogin.fields[0].fullname)
      this.insertTransactionForm.get('phone').setValue(this.apilogin.fields[0].phone)
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
  canPostPayment = false
  setDeliverOption(event: any){
    this.deliverOption = event.target.value
    if(this.deliverOption === '0'){
      this.canPostPayment = true
    } else {
      this.canPostPayment = false
    }
    
    if(this.shippingCost){
      this.shippingCost.forEach((ix: any) => {
        this.totalCostShipping = this.totalCostShipping - ix.costs
      })
    }
    this.shippingCost = []
    this.selectedAddressDatas = null
    
  }

  logAddress(){
    console.log(this.collectionAddress);
    
  }

  insertTransactionForm: any
  createFormTransaction(){
    this.insertTransactionForm = this.fb.group({
      userid: ['', Validators.required],
      full_name: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      paymentradio: ['bca', Validators.required], 
    })
  }

  geko(){
    console.log(this.insertTransactionForm.value);
    
    console.log(this.differentMerchant);


  }

  selectedAddressDatas: any = null
  selectedAddress(event: any){
    this.selectedAddressDatas = null
    this.canPostPayment = false
    
    if(this.select_package){
      this.select_package.nativeElement.value = '-1'
    }

    if(this.shippingCost){
      this.shippingCost.forEach((ix: any) => {
        this.totalCostShipping = this.totalCostShipping - ix.costs
      })
      this.shippingCost = []
    }

    this.collectionAddress.fields.forEach((element: any) => {
      if(element.addressid === parseInt(event.target.value)){
        this.selectedAddressDatas = element
      }
    });
  }

  @ViewChild('select_package') select_package!: ElementRef
  
  shippingCost: any = []
  resRajaOngkir: any
  checkCostShipping(event: any){
    if(this.shippingCost){
      this.shippingCost.forEach((ix: any) => {
        this.totalCostShipping = this.totalCostShipping - ix.costs
      })
      this.shippingCost = []
    }

    this.shippingTo.forEach((e: any, indx: any) => {
      let totalWeight = 0
      this.afterCart[indx].forEach((ex: any) => {
        totalWeight = totalWeight + ex.totalWeight
      });
      this.curdService.getCostShipping(e.city, this.selectedAddressDatas.city, totalWeight, event.target.value).subscribe((res: any) => {
        if(res.statQuo === '1'){
          let tempdatas = JSON.parse(res.res)
          this.resRajaOngkir = tempdatas.rajaongkir.results[0].costs

          this.resRajaOngkir.forEach((i: any, index:any) => {
            if (i.service === 'CTC'){
              this.shippingCost.push({costs: i.cost[0].value, etd: i.cost[0].etd, from: tempdatas.rajaongkir.origin_details.city_name, to: tempdatas.rajaongkir.destination_details.city_name, total_weight: totalWeight})
              this.totalCostShipping = this.totalCostShipping + i.cost[0].value
            } else {
              if(i.service === event.target.value){
               this.shippingCost.push({costs: i.cost[0].value, etd: i.cost[0].etd, from: tempdatas.rajaongkir.origin_details.city_name, to: tempdatas.rajaongkir.destination_details.city_name, total_weight: totalWeight})
                this.totalCostShipping = this.totalCostShipping + i.cost[0].value
              } 
            }
          });

        }
      })      
    });

    this.canPostPayment = true
  }

  getSCs(an: any){
    this.resRajaOngkir.forEach((i: any) => {
      if(i.service === an){
        this.shippingCost.push(i.cost[0].value)
        console.log(i);
      }
    });

  }
  
  
  postPayment(){
    let request_payment: any
    if(this.insertTransactionForm.value.paymentradio === 'alfamart' || this.insertTransactionForm.value.paymentradio === 'Indomaret'){
      request_payment = {
        "payment_type": "cstore",
        "cstore": {
          "store": this.insertTransactionForm.value.paymentradio,
          "message": "Ops Payment"
        },
        "customer_details": {
          "userid": this.insertTransactionForm.value.userid,
          "email": this.insertTransactionForm.value.email,
          "full_name": this.insertTransactionForm.value.full_name,
          "phone": this.insertTransactionForm.value.phone
        },
        "transaction_details": {
          "order_id": Math.floor(Date.now() / 1000),
          "gross_amount": this.totalCostShipping
        },"item_details_ops": this.afterCart
      }
    } else {
      request_payment = {
        "payment_type": "bank_transfer",
        "bank_transfer": {
          "bank": this.insertTransactionForm.value.paymentradio,
          "va_number": Math.floor(Date.now() / 1000),
        },
        "customer_details": {
          "userid": this.insertTransactionForm.value.userid,
          "email": this.insertTransactionForm.value.email,
          "full_name": this.insertTransactionForm.value.full_name,
          "phone": this.insertTransactionForm.value.phone
        },
        "transaction_details": {
          "order_id": Math.floor(Date.now() / 1000),
          "gross_amount": this.totalCostShipping
        },
        "item_details_ops": {collection_order: this.afterCart}
      }
    }
    if(this.shippingCost.length < 1){
      if(this.deliverOption === '0'){
        this.curdService.request_payment_midtrans(request_payment).subscribe((res: any) => {
          console.log(res);
        })
      }
    } else {
      this.curdService.request_payment_midtrans(request_payment).subscribe((res: any) => {
        console.log(res);
      })
    }
    
  }

}
