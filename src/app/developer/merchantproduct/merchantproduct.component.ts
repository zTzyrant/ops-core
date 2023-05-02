import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DevService } from 'src/app/secure/auth/dev.service';
import { CurdApiService } from 'src/app/secure/curd.api.service';
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';

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
    private devService: DevService,
    private sanitizer: DomSanitizer
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
    this.updateProduct()
    this.updateProductType()
    this.updateProductColor()
    this.updatePrintQuality()
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
    this.insertProductTypeForm.get('merchantid').setValue(event.target.value)

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
    
    this.insertProductTypeForm.get('productid').setValue(event.target.value)
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
  insertProductTypeForm:any
  imageProductTypeForm: any


  productTypeForm(){
    this.insertProductTypeForm = this.fb.group({
      merchantid: ['', Validators.required],
      productid: ['', Validators.required],

      producttitle: ['', Validators.required],
      category: ['', Validators.required],
      paperprice: ['', Validators.required],
      quantity: ['', Validators.required],
      imageProduct: ['', Validators.required],
      weight: ['', Validators.required]
    })
  }

  submitProductType(){
    if(this.insertProductTypeForm.invalid) {
      this.insertProductTypeForm.markAllAsTouched()
      this.toast.error('Please check your inputed data !', 'Form data cannot be null')
      return
    }

    let formData = new FormData();
    formData.set("anyfilesnames", this.imageProductTypeForm)
    this.devService.uploadImagesProductType(formData).subscribe((res:any) => {
      if(res.resUpload.statusCode === 202){
        this.insertProductTypeForm.value.imageProduct = res.resUpload.filePath
        console.log(this.insertProductTypeForm.value)
        this.devService.postNewProductType(this.insertProductTypeForm.value).subscribe((res:any) => {
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

  // update product
  updateProductForm: any
  tempUpdateProduct: any
  selectUpdateProduct(data: any){
    this.tempUpdateProduct = data
    console.log(data);
    
    this.updateProductForm.get('productid').setValue(data.productid)
    this.updateProductForm.get('producttitle').setValue(data.producttitle)
    this.updateProductForm.get('productdescription').setValue(data.productdescription)
    this.updateProductForm.get('category').setValue(data.category)
  }

  updateProduct(){
    this.updateProductForm = this.fb.group({
      productid: ['', Validators.required],
      producttitle: ['', Validators.required],
      productdescription: ['', Validators.required],
      saf: [''],
      category: ['', [Validators.required]]
    })
  }

  submitUpdateProduct(){
    if(this.updateProductForm.invalid){
      this.updateProductForm.markAllAsTouched()
      this.selectUpdateProduct(this.tempUpdateProduct)
      this.toast.error('Please check your inputed data !', 'Form data cannot be null')
      return
    }
    this.devService.updateProductById(this.updateProductForm.value).subscribe((res:any) => {
      if(res === 1){
        this.merchantListDat()
        this.merchSelected = false
        this.prodSelected = false
        this.productSelected = undefined
        this.toast.success("Successfully Update Product");
      } else {
        this.toast.error("Internal Server Error While Update Data")
      }
    })
  }


  // update product type
  updateProductTypeForm: any
  tempUpdateProductType: any
  tempImageProduct: any = ''
  isImagechages = false
  updateIMGProductTypeImage: any

  selectUpdateProductType(data: any){
    this.tempImageProduct = data.imageurl
    
    this.tempUpdateProductType = data
    this.updateProductTypeForm.get('productypeid').setValue(data.productypeid)
    this.updateProductTypeForm.get('producttitle').setValue(data.papertype)
    this.updateProductTypeForm.get('category').setValue(data.category)
    this.updateProductTypeForm.get('paperprice').setValue(data.paperprice)
    this.updateProductTypeForm.get('weight').setValue(data.weight)
    this.updateProductTypeForm.get('quantity').setValue(data.quantity)
    
  }

  updateProductType(){
    this.updateProductTypeForm = this.fb.group({
      productypeid: ['', Validators.required],
      producttitle: ['', Validators.required],
      category: ['', Validators.required],
      paperprice: ['', Validators.required],
      quantity: ['', Validators.required],
      imageurl: [''],
      weight: ['', Validators.required]
    })
  }

  submitUpdateProductType(){
    if(this.updateProductTypeForm.invalid){
      this.updateProductTypeForm.markAllAsTouched()
      this.selectUpdateProductType(this.tempUpdateProductType)
      this.isImagechages = false
      this.updateIMGProductTypeImage = null
      this.toast.error('Please check your inputed data !', 'Form data cannot be null')
      return
    }
    if(this.updateIMGProductTypeImage){
      let formData = new FormData();
      formData.set("anyfilesnames", this.updateIMGProductTypeImage)
      this.devService.uploadImagesProductType(formData).subscribe((res:any) => {
        if(res.resUpload.statusCode === 202){
          this.updateProductTypeForm.value.imageurl = res.resUpload.filePath
          console.log(this.updateProductTypeForm.value)
          this.devService.updateProductTypeById(this.updateProductTypeForm.value).subscribe((res:any) => {
            if(res === 1){
              this.merchantListDat()
              this.merchSelected = false
              this.prodSelected = false
              this.productSelected = undefined
              this.toast.success("Success Insert New Product Type");
            } else {
              this.toast.error("Internal Server Error While Update Data")
            }
          })
        } else {
          this.toast.error("Internal Server Error While Upload Images")
        }
      })
      
    } else {
      this.devService.updateProductTypeById(this.updateProductTypeForm.value).subscribe((res:any) => {
        if(res === 1){
          this.merchantListDat()
          this.merchSelected = false
          this.prodSelected = false
          this.productSelected = undefined
          this.toast.success("Success Insert New Product Type");
        } else {
          this.toast.error("Internal Server Error While Update Data")
        }
      })
    }

  }

  updateTease(event: any){
    this.updateIMGProductTypeImage = event.target.files[0]
    console.log(this.updateIMGProductTypeImage);
    if(this.updateIMGProductTypeImage.type != 'image/png' && this.updateIMGProductTypeImage.type != 'image/jpeg'){
      this.toast.info('following type is jpeg jpg png', 'Please put correct files only !')
      this.tempImageProduct = this.tempUpdateProductType.imageurl
    }
    else {
      if(event.target.files[0].size >= 5242880){
        this.tempImageProduct = this.tempUpdateProductType.imageurl
        this.toast.info('Please put files size less than 5MB only !')
      }
      this.updateIMGProductTypeImage = event.target.files[0]
      this.tempImageProduct = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(event.target.files[0]))
    }
  }

  resetImageUpdateProductType(){
    this.tempImageProduct = this.tempUpdateProductType.imageurl
    this.updateProductTypeForm.get('imageurl').reset()
    this.isImagechages = false
  }

  // update product print color
  updateProductColorForm:any
  tempUpdatePrintColor: any

  selectUpdatePrintColor(data: any){
    this.tempUpdatePrintColor = data
    
    this.updateProductColorForm.get('colortypeid').setValue(data.colortypeid)
    this.updateProductColorForm.get('colortype').setValue(data.colortype)
    this.updateProductColorForm.get('colorfee').setValue(data.colorfee)
  }

  updateProductColor(){
    this.updateProductColorForm = this.fb.group({
      colortypeid: ['', Validators.required],

      colortype: ['', Validators.required],
      colorfee: ['', Validators.required]
    })
  }

  submitUpdatePrintColor(){
    if(this.updateProductColorForm.invalid) {
      this.updateProductColorForm.markAllAsTouched()
      this.selectUpdatePrintColor(this.tempUpdatePrintColor)
      this.toast.error('Please check your inputed data !', 'Form data cannot be null')
      return
    }
    

    this.devService.updatePrintColorById(this.updateProductColorForm.value).subscribe((res:any) => {
      if(res === 1){
        this.merchantListDat()
        this.merchSelected = false
        this.prodSelected = false
        this.productSelected = undefined
        this.toast.success("Success Insert New Product Type");
      } else {
        this.toast.error("Internal Server Error While Update Data")
      }
    })
  }

  // Update Product print Quality
  updatePrintQualityForm:any
  tempUpdatePrintQuality: any

  selectUpdatePrintQuality(data: any){
    this.tempUpdatePrintQuality = data
    
    this.updatePrintQualityForm.get('printqualityid').setValue(data.printqualityid)
    this.updatePrintQualityForm.get('printquality').setValue(data.printquality)
    this.updatePrintQualityForm.get('printqualityfee').setValue(data.printqualityfee)
  }

  updatePrintQuality(){
    this.updatePrintQualityForm = this.fb.group({
      printqualityid: ['', Validators.required],

      printquality: ['', Validators.required],
      printqualityfee: ['', Validators.required]
    })
  }

  submitUpdatePrintQuality(){
    if(this.updatePrintQualityForm.invalid) {
      this.updatePrintQualityForm.markAllAsTouched()
      this.selectUpdatePrintQuality(this.tempUpdatePrintQuality)
      this.toast.error('Please check your inputed data !', 'Form data cannot be null')
      return
    }

    this.devService.updatePrintQualityById(this.updatePrintQualityForm.value).subscribe((res:any) => {
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
}
