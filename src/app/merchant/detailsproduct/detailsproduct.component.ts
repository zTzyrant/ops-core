import { Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CurdApiService } from 'src/app/secure/curd.api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detailsproduct',
  templateUrl: './detailsproduct.html',
  styleUrls: ['./detailsproduct.css',
  ],
})
export class DetailsproductComponent {
  extendDesc = false
  public orderform: FormGroup | any
  file: any
  statsFiles: any = null
  totalpages: any = 0
  msgpages: any = "Calculate pdf pages."

  allProduct: any
  productidquery: any

  currentProd: any = ''
  currentProdService: any = ''

  itemsmall = -1

  selectedPaper = 1
  maxorederCopies = 1

  filesformData: any

  constructor(
    private route: ActivatedRoute,
    public fb: FormBuilder,
    private curdService: CurdApiService,
    private toast : ToastrService,
  ){    
    this.orderformValidator()
    this.getProdFromParam()
  }

  getProdFromParam(){
    // call prod id from route link
    let tempQuery: any
    tempQuery = this.route.snapshot.params
    this.productidquery = tempQuery.productid
    this.curdService.getProductById(this.productidquery).subscribe(result => {
      this.allProduct = result
      this.allProduct.forEach((datas: any) => {        
        this.currentProd = datas.productOPS
        this.currentProdService = datas.productService
      })
      // set default value
      this.orderform.controls['color'].setValue(this.currentProdService.printColorsOPS[0].colortype)
      this.orderform.controls['papertype'].setValue(this.currentProdService.productTypeOPS[0].papertype)
      this.orderform.controls['quality'].setValue(this.currentProdService.printQualityOPS[0].printquality)
      this.getIndexOfDatas()
    })
  }

  getIndexOfDatas(){
  
    const findColor = (x: any) => x.colortype === this.color.value
    this.colorselectedIndx = this.currentProdService.printColorsOPS.findIndex(findColor)
    this.selectColorFee = this.currentProdService.printColorsOPS[this.colorselectedIndx].colorfee

    const findProductType = (x: any) => x.papertype === this.papertype.value
    this.paperSelectedIndx = this.currentProdService.productTypeOPS.findIndex(findProductType)
    this.selectTypeFee = this.currentProdService.productTypeOPS[this.paperSelectedIndx].paperprice

    const findQuality = (x: any) => x.printquality === this.quality.value
    this.qualityselectedIndx = this.currentProdService.printQualityOPS.findIndex(findQuality)
    this.selectQualityFee = this.currentProdService.printQualityOPS[this.qualityselectedIndx].printqualityfee

    console.log(this.orderform.value);
    
    this.totalPrice = (this.selectColorFee + this.selectTypeFee + this.selectQualityFee) * parseInt(this.copies.value)
    console.log(this.totalpages);
    
  }

  slideto(dat:any){
    var myCarousel = document.getElementById('carouselExampleIndicators')
    var carousel = new bootstrap.Carousel(myCarousel)
    carousel.to(dat)
  }

  ngAfterViewInit(){
    logme()
    
  }
  
  orderformValidator() {
    this.orderform = this.fb.group({
      color: ['', [Validators.required]],
      papertype: ['', [Validators.required]],
      quality: ['', [Validators.required]],
      copies: ['1', [Validators.required, Validators.min(1)]],
      inputedfile: ['']
    
    });

  }

  moredetails() {
    this.extendDesc = !this.extendDesc
  }

  // num of copies
  numofcopies(updown: any){
    if(updown === 1){
      this.copies.value++;
      this.orderform.controls['copies'].setValue(this.copies.value);
    } else{
      if(this.copies.value > 1){
        this.copies.value--;
        this.orderform.controls['copies'].setValue(this.copies.value);
      }
    }
  }

  tease(event: any){
    this.file = event.target.files[0]
    this.statsFiles = null
    if(this.file.type != 'application/pdf'){
      this.inputedfile.reset()
      this.file = null
      this.toast.info('Please put .pdf files only !')
    } else {
      this.filesformData = new FormData();
      this.filesformData.set("anyfilesnames", this.file)

      //calc page num
      this.curdService.checkpdfpages(this.filesformData).subscribe((res: any) => {
        if(res.resUpload.statusCode === 200 ){
          this.totalpages = res.resUpload.totalPages
          this.msgpages = `Your file has ${res.resUpload.totalPages} pages.`
        } else {
          this.toast.error('Internal server error', 'Please select another files')
        }
      })
    }

  }

  resetfile(){
    this.inputedfile.reset()
    this.file = null
  }

  uploadfilefromoutside(){
    let formData = new FormData();
    formData.set("anyfilesnames", this.file)
    this.curdService.uploadorderpdf(formData).subscribe(res => {
      let somz:any = res
      if(somz.resUpload.statusCode === 202){
        this.setVale(somz.resUpload.filePath)
        this.toast.success('Successfully Upload files')
      } else {
        this.statsFiles = null
        this.toast.error('Internal server error')
      }
    })
  }

  submitOrder(){
    if(!localStorage.getItem('logindatas')){
      this.toast.error('Please login before submit order')
      let loginModal: any = new (window as any).bootstrap.Modal(
        document.getElementById("loginModalConsumer")
      );

      var myModalEl = document.getElementById('viewTransactionInfo');
      var orderModal = bootstrap.Modal.getInstance(myModalEl)

      loginModal.show()
      orderModal.hide();
    } else {
      let formData = new FormData();
      formData.set("anyfilesnames", this.file)
      this.curdService.uploadorderpdf(formData).subscribe(res => {
        let somz:any = res
        if(somz.resUpload.statusCode === 202){
          this.setVale(somz.resUpload.filePath)
          var myModalEl = document.getElementById('viewTransactionInfo');
          var orderModal = bootstrap.Modal.getInstance(myModalEl)
          orderModal.hide();

          this.orderform.value.inputedfile = somz.resUpload.filePath
          localStorage.setItem('orderdata', this.orderform.value)
          Swal.fire('Success!', 'Successfully add order to chart', 'success')
          this.curdService.setNotif(false)
        } else {
          this.statsFiles = null
          this.toast.error('Internal server error')
        }
      })
    }
  }

  setTotalPages(numpages: any){
    this.totalpages = numpages
    this.msgpages = `Your file has ${numpages} pages.`
  }

  setVale(dat: any){
    this.statsFiles = dat
    console.log(this.statsFiles);
  }

  // getter
  get color(){
    return this.orderform.get('color');
  }

  get papertype(){
    return this.orderform.get('papertype');
  }

  get quality(){
    return this.orderform.get('quality');
  }

  get copies(){
    return this.orderform.get('copies');
  }

  get inputedfile(){
    return this.orderform.get('inputedfile');
  }

  ////////////
  colorselectedIndx: any
  selectColorFee: any
  paperSelectedIndx: any
  selectTypeFee: any
  qualityselectedIndx: any
  selectQualityFee: any
  dateNowOrder = new Date()
  totalPrice = 0.0
}
