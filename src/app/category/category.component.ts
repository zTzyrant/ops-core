import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';


@Component({
  selector: 'my-categorypage',
  templateUrl: './category.html',
  styleUrls: ['./category.css'],
})

export class CategoryComponent{
  datas: any

  constructor(private http: HttpClient){
    
  }

  ngOnInit(): void {
    this.datas = this.http.get('assets/productfake.json')
    console.log(this.datas.product);
    
  }

  viewProduct(url: any){
    location.href = url
  }
}
