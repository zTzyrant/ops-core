import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DevService } from 'src/app/secure/auth/dev.service';
import { CurdApiService } from 'src/app/secure/curd.api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-merchantproduct',
  templateUrl: './dev.merchantproduct.dashboard.html',
  styleUrls: ['../dashboard/dev.dashboard.css',
    '../../../assets/css/argon-dashboard.css',
    "../../../assets/css/nucleo-svg.css",
    "../../../assets/css/nucleo-icons.css",
  ]
})
export class MerchantproductComponent {
  showNav = false
  arras: string[]= []
  devDatas: any
  merchData: any
  merchSelected = false
  merchSelectedIndex: any
  touchedSelected: any

  productSelected: any

  constructor(
    public fb: FormBuilder,
    private curdService: CurdApiService,
    private toast : ToastrService,
    private router: Router,
    private devService: DevService
  ){
    if(localStorage.getItem('__$DEV__TOKEN__')){
      this.devService.checkValidLoginDev(localStorage.getItem('__$DEV__TOKEN__'))
      this.devDatas = JSON.parse(localStorage.getItem('_____$DevDatas_____')!)
    }
    
    this.merchantListDat()
    this.productForm()
    this.productTypeForm()
    this.productColorForm()
    this.productQualityForm()
  }

  signDevOut(){ this.devService.destroyDevSid() }

  // get all merchant to datatables
  merchantListDat(){
    this.devService.getAllMerchantProduct().subscribe(res => {      
      this.merchData = res
    })
  }

  selectedMerchGoods(event: any){
    this.merchSelected = false
    this.touchedSelected = event.target.value
    this.merchSelectedIndex = event.target.value
    this.getProduct(this.merchSelectedIndex)
    this.insertProdForm.get('merchantid').setValue(event.target.value)

  }

// tinggal form color, quality

  getProduct(idMerchant: any){
    this.prodSelected = false
    this.productSelected = false
    this.devService.getMerchantProductDetails(idMerchant).subscribe((res: any) => {
      if(res){
        this.productSelected = res
        $(document).ready(function () {
          $('#listProduct').DataTable().destroy()
          $('#listProduct').DataTable({
            scrollX: true,
            pageLength: 5,
            lengthChange: false
          })
        })
      }
    })
    this.merchSelected = true
  }

  getProductById(id: any){
    this.prodSelected = false
    this.devService.getMerchantProductDetailsById(id).subscribe((res: any) => {
      this.productArr = res
      this.prodSelected = true
      $(document).ready(function () {
        $('#listPaper').DataTable().destroy()
        $('#listColor').DataTable().destroy()
        $('#listQuality').DataTable().destroy()
  
        $('#listPaper').DataTable({
          scrollX: true,
          pageLength: 5,
          lengthChange: false
        });
        $('#listColor').DataTable({
          scrollX: true,
          pageLength: 5,
          lengthChange: false,
        });
        $('#listQuality').DataTable({
          scrollX: true,
          pageLength: 5,
          lengthChange: false,
        });
      })
    })
    
  }

  productArr: any
  selectedProductIndex: any
  prodSelected = false
  prodDetails: any

  /// ini tambah
  selectProduct(event: any){
    this.getProductById(event.target.value)
    this.selectedProductIndex = event.target.value
    this.insertProductTpyeForm.get('merchantid').setValue(event.target.value)
    this.insertProductTpyeForm.get('productid').setValue(event.target.value)
    this.insertProductColorForm.get('productid').setValue(event.target.value)
    this.insertProductQualityForm.get('productid').setValue(event.target.value)

  }

  setShowNav(){
    this.showNav = !this.showNav
  }

  // Form Insert Product
  insertProdForm:any

  productForm(){
    this.insertProdForm = this.fb.group({
      merchantid: ['', Validators.required],
      producttitle: ['', Validators.required],
      productdescription: ['', Validators.required],
      category: ['', [Validators.required]]
    })
  }

  submitProduct(){
    if(this.insertProdForm.invalid){
      this.insertProdForm.markAllAsTouched()
      this.toast.error('Please check your inputed data !', 'Form data cannot be null')
      return
    }
    this.devService.postNewProduct(this.insertProdForm.value).subscribe((res:any) => {
      if(res === 1){
        this.toast.success('Successfully Submit New Product', `For Merchant id: ${this.touchedSelected}`)
        this.merchantListDat()
        this.merchSelected = false
        this.prodSelected = false
        this.productSelected = undefined
      } else {
        this.toast.error('Internal Server Error')
      }
    })
    console.log(this.insertProdForm.value);
  }

  // Form Insert Product Type
  insertProductTpyeForm:any
  imageProductTypeForm: any


  productTypeForm(){
    this.insertProductTpyeForm = this.fb.group({
      merchantid: ['', Validators.required],
      productid: ['', Validators.required],

      producttitle: ['', Validators.required],
      category: ['', Validators.required],
      paperprice: ['', Validators.required],
      quantity: ['', Validators.required],
      imageProduct: ['', Validators.required]
    })
  }

  submitProductType(){
    if(this.insertProductTpyeForm.invalid) {
      this.insertProductTpyeForm.markAllAsTouched()
      this.toast.error('Please check your inputed data !', 'Form data cannot be null')
      return
    }

    let formData = new FormData();
    formData.set("anyfilesnames", this.imageProductTypeForm)
    this.devService.uploadImagesProductType(formData).subscribe((res:any) => {
      if(res.resUpload.statusCode === 202){
        this.insertProductTpyeForm.value.imageProduct = res.resUpload.filePath
        console.log(this.insertProductTpyeForm.value)
        this.devService.postNewProductType(this.insertProductTpyeForm.value).subscribe((res:any) => {
          if(res === 1){
            this.merchantListDat()
            this.merchSelected = false
            this.prodSelected = false
            this.productSelected = undefined
            this.toast.success("Success Insert New Product Type");
          } else {
            this.toast.error("Internal Server Error While Insert Data")
          }
        })
      } else {
        this.toast.error("Internal Server Error While Upload Images")
      }
    })
  }

  @ViewChild('imageInput', {static: false}) imageInput!: ElementRef;
  tease(event: any){
    this.imageProductTypeForm = event.target.files[0]
    console.log(this.imageProductTypeForm);
    
    if(this.imageProductTypeForm.type != 'image/png' && this.imageProductTypeForm.type != 'image/jpeg'){
      this.toast.info('following type is jpeg jpg png', 'Please put correct files only !')
      this.imageInput.nativeElement.value = ''
    }
    else {
      if(event.target.files[0].size >= 5242880){
        this.imageInput.nativeElement.value = ''
        this.toast.info('Please put files size less than 5MB only !')
      }
    }
  }

  // Form Insert Product Color
  insertProductColorForm:any

  productColorForm(){
    this.insertProductColorForm = this.fb.group({
      productid: ['', Validators.required],

      colortype: ['', Validators.required],
      colorfee: ['', Validators.required]
    })
  }

  submitPrintColor(){
    if(this.insertProductColorForm.invalid) {
      this.insertProductColorForm.markAllAsTouched()
      this.toast.error('Please check your inputed data !', 'Form data cannot be null')
      return
    }

    this.devService.postNewPrintColor(this.insertProductColorForm.value).subscribe((res:any) => {
      if(res === 1){
        this.merchantListDat()
        this.merchSelected = false
        this.prodSelected = false
        this.productSelected = undefined
        this.toast.success("Success Insert New Print Color");
      } else {
        this.toast.error("Internal Server Error While Insert Data")
      }
    })
  }

  // Form Insert Product Quality
  insertProductQualityForm:any

  productQualityForm(){
    this.insertProductQualityForm = this.fb.group({
      productid: ['', Validators.required],

      printquality: ['', Validators.required],
      printqualityfee: ['', Validators.required]
    })
  }

  submitPrintQuality(){
    if(this.insertProductQualityForm.invalid) {
      this.insertProductQualityForm.markAllAsTouched()
      this.toast.error('Please check your inputed data !', 'Form data cannot be null')
      return
    }

    this.devService.postNewPrintQuality(this.insertProductQualityForm.value).subscribe((res:any) => {
      if(res === 1){
        this.merchantListDat()
        this.merchSelected = false
        this.prodSelected = false
        this.productSelected = undefined
        this.toast.success("Success Insert New Print Quality");
      } else {
        this.toast.error("Internal Server Error While Insert Data")
      }
    })
  }

  // delete section
  // delete product
  deleteProduct(id:any){
    console.log(id);
    Swal.fire({
      title: 'Delete Product ?',
      text: 'By deleting this product will delete all following product data.',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#07484A'
    }).then((result) => {
      if (result.isConfirmed) {
        this.devService.deleteProductById(id).subscribe((res: any) => {
          if(res  === 1){
            Swal.fire('', 'Susscessfully Delete Product', 'success')
            this.merchantListDat()
            this.merchSelected = false
            this.prodSelected = false
            this.productSelected = undefined
          } else {
            Swal.fire('', 'Internal Server Error', 'error')
          }
        })
      }
    })
  }

  // delete product type
  deleteProductType(id:any){
    console.log(id);
    Swal.fire({
      title: 'Delete Product Type?',
      text: 'These changes cannot be undone.',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#07484A'
    }).then((result) => {
      if (result.isConfirmed) {
        this.devService.deleteProductTypeById(id).subscribe((res: any) => {
          if(res  === 1){
            Swal.fire('', 'Susscessfully Delete Product Type', 'success')
            this.merchantListDat()
            this.merchSelected = false
            this.prodSelected = false
            this.productSelected = undefined
          } else {
            Swal.fire('', 'Internal Server Error', 'error')
          }
        })
      }
    })
  }

  // delete print color
  deletePrintColor(id:any){
    console.log(id);
    Swal.fire({
      title: 'Delete This Color ?',
      text: 'These changes cannot be undone.',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#07484A'
    }).then((result) => {
      if (result.isConfirmed) {
        this.devService.deletePrintColorById(id).subscribe((res: any) => {
          if(res  === 1){
            Swal.fire('', 'Susscessfully Delete Print Color', 'success')
            this.merchantListDat()
            this.merchSelected = false
            this.prodSelected = false
            this.productSelected = undefined
          } else {
            Swal.fire('', 'Internal Server Error', 'error')
          }
        })
      }
    })
  }

  // delete print quality
  deletePrintQuality(id:any){
    console.log(id);
    Swal.fire({
      title: 'Delete This Quality ?',
      text: 'These changes cannot be undone.',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#07484A'
    }).then((result) => {
      if (result.isConfirmed) {
        this.devService.deletePrintQualityById(id).subscribe((res: any) => {
          if(res  === 1){
            Swal.fire('', 'Susscessfully Print Quality', 'success')
            this.merchantListDat()
            this.merchSelected = false
            this.prodSelected = false
            this.productSelected = undefined
          } else {
            Swal.fire('', 'Internal Server Error', 'error')
          }
        })
      }
    })
  }
}
