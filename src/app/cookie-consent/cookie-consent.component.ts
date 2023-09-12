import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cookie-consent',
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.css'],
})
export class CookieConsentComponent implements OnInit {
  showConsent = true;

  ngOnInit() {
    this.showConsent = !localStorage.getItem('cookiesAccepted');
  }

  acceptCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    this.showConsent = false;
  }
}
