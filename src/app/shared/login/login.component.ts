import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
 
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  username = '';
  password = '';
 
 
  constructor(private authService: AuthService, private router: Router) { }
 
  login(): void {
    if (!this.username.trim()) {
      return;
    }
    this.authService.login(this.username.trim());
    this.router.navigate(['/']);
  }
}
 
 