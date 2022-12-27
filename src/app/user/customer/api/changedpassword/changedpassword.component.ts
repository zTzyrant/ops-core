import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-changedpassword',
  template: `
    <p>
      changedpassword works!
    </p>
  `,
  styles: [
  ]
})
export class ChangedpasswordComponent {
  apiEmail: any;
  apiToken: any;
    constructor(private route: ActivatedRoute) {
      this.apiEmail = this.route.snapshot.queryParams['email'];
      this.apiToken = this.route.snapshot.queryParams['salt'];
      console.log(this.apiEmail);
      console.log(this.apiToken);
  
  }
  ngOnInit(){

  }
}
