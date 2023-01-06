import { Component } from '@angular/core';

@Component({
  selector: 'my-categorypage',
  templateUrl: './category.html',
  styleUrls: ['./category.css'],
})

export class CategoryComponent{
  ngOnInit(): void {
    
  }

  viewProduct(url: any){
    location.href = url
  }
}
