import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  cookiesAccepted = false;
  title = 'tfg_ecommerce_client';
  ngOnInit() {
    this.cookiesAccepted = localStorage.getItem('cookiesAccepted') === 'true';
  }
}
