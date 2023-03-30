import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CurdApiService } from '../secure/curd.api.service';


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

  constructor(
    private http: HttpClient,
    private curdService: CurdApiService
  ){
    
  }

  ngOnInit(): void {
    this.getAllProduct()
    this.getAllCategory()
    this.getAllLocation()
  }

  getAllProduct(){
    this.curdService.getAllOpsProduct().subscribe((res:any) => {
      this.allProduct = res
    })
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

  viewProduct(url: any){
    location.href = url
  }
}
