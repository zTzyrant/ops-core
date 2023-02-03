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

  constructor(
    private http: HttpClient,
    private curdService: CurdApiService
  ){
    
  }

  ngOnInit(): void {
    this.datas = this.http.get('assets/productfake.json')
    console.log(this.datas.product);
    this.curdService.getAllOpsProduct().subscribe(result => {
      this.allProduct = result
      console.log(this.allProduct);
      
    })
  }

  viewProduct(url: any){
    location.href = url
  }
}
