import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      searchParam: [''],
    });
  }
  ngOnInit(): void {}

  searchProducts() {
    const searchParam = this.form.value.searchParam;

    if (searchParam && searchParam.trim() != '') {
      this.router.navigate(['/search/' + searchParam]);
    }
  }
}
