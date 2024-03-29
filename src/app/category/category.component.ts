import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CurdApiService } from '../secure/curd.api.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'my-categorypage',
  templateUrl: './category.html',
  styleUrls: ['./category.css'],
})

export class CategoryComponent{
  datas: any
  allProduct: any
  allCategory: any
  allLocation: any
  productGrab = false
  searchFilter!: string
  constructor(
    private http: HttpClient,
    private curdService: CurdApiService,
    private router: ActivatedRoute
  ){
    this.searchFilter = this.router.snapshot.params['search']
  }


  ngOnInit(): void {
    this.getAllProduct()
    this.getAllCategory()
    this.getAllLocation()
  }

  getAllProduct(){
    this.productGrab = false
    this.curdService.getAllOpsProduct().subscribe(
      (res:any) => {
      this.allProduct = res
      this.productGrab = true
      }, (err: any) =>{        
        Swal.fire({
          title: '<strong>Error Cannot Reach Backend</strong>',
          icon: 'error',
          html:
            'If you see this message please email me at <a href="mailto:ztzyrant@gmail.com">ztzyrant@gmail.com</a>'+
            '<br>Or you can use this website locally on your computer ! <br>' +
            'Read At <a href="https://github.com/zTzyrant/ops-core">OPS-Core</a>',
          showCloseButton: false,
          showCancelButton: false,
          focusConfirm: false,
          showDenyButton: false,
          allowEscapeKey: false,
          allowOutsideClick: false,
          confirmButtonText: 'Great !',
        })
      }
    )
  }

  getAllCategory(){
    this.curdService.getAllCategoryProd().subscribe((res:any) => {
      this.allCategory = res
    })
  }

  getAllLocation(){
    this.curdService.getAllLocationProd().subscribe((res:any) => {
      this.allLocation = res
    })
  }

  getProductByCity(event: any){
    this.productGrab = false
    this.curdService.getProductByCity(event.target.value).subscribe((res:any) =>{
      this.allProduct = res
      this.productGrab = true
    })
  }

  getProductByPaper(event: any){
    this.productGrab = false
    this.curdService.getProductByCategory(event.target.value).subscribe((res:any) =>{
      this.allProduct = res
      this.productGrab = true
    })
  }

  viewProduct(url: any){
    location.href = url
  }
}
