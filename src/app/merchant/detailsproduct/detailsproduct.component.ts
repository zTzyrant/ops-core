import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CurdApiService } from 'src/app/secure/curd.api.service';

@Component({
  selector: 'app-detailsproduct',
  templateUrl: './detailsproduct.html',
  styleUrls: ['./detailsproduct.css',
  ]
})
export class DetailsproductComponent {
  extendDesc = false
  public orderform: FormGroup | any
  file: any
  statsFiles: any = null
  totalpages: any = null
  msgpages: any = "Calculate pdf pages."

  constructor(
    public fb: FormBuilder,
    private curdService: CurdApiService,
    private toast : ToastrService
  ){
    this.orderformValidator()
  }

  ngAfterViewInit(){
    logme()
  }
  
  orderformValidator() {
    this.orderform = this.fb.group({
      color: ['Grayscale'],
      papertype: ['A4 100 grams'],
      quality: ['Draft'],
      copies: ['1', [Validators.required, Validators.min(1)]],
      inputedfile: ['']
    
    });

  }

  moredetails() {
    this.extendDesc = !this.extendDesc
    console.log(this.extendDesc);
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
      let formData = new FormData();
      formData.set("anyfilesnames", this.file)

      //calc page num
      this.curdService.checkpdfpages(formData).subscribe(res => {
        let somz:any = res
        
        if(somz.resUpload.statusCode === 200 ){
          this.setTotalPages(somz.resUpload.totalPages)
        } else {
          this.toast.error('Internal server error', 'Please select another files')
        }
      })
    }

    console.log(this.file)
  }

  resetfile(){
    this.inputedfile.reset()
    this.file = null
  }

  uploadfilefromoutside(){
    this.file
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
}
