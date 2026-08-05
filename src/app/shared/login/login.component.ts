import { Component } from '@angular/core';
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
  loginError = '';
 
  constructor(private authService: AuthService, private router: Router) { }
 
  login(): void {
    const username = this.username.trim();
    const password = this.password.trim();
    this.loginError = '';

    if (!username || !password) {
      this.loginError = 'Usuario y contraseña son requeridos.';
      return;
    }

    this.authService.login(username, password).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => {
        this.loginError = 'Usuario o contraseña inválidos.';
      }
    });
  }
}

 