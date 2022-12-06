import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './home.html',
  styles: [
  ]
})
export class HomepageComponent {
  datas: any;
  constructor(private http: HttpClient) {
    
  }

  ngOnInit(){
    this.http.get('http://localhost:3000/data').subscribe(datas => {
      this.datas = datas;
      this.datas = this.datas.payload.datas;
    })
  }
}
