import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  myObject = {
    name : "john doe",
    age : 32,
    gender : "male",
    profession : "optician" 
  }
  
  apilogin = localStorage.getItem('logindatas');
  signout(){
    localStorage.removeItem('logindatas')
    location.reload();
  }
}
