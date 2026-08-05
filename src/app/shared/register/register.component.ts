import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { RegisterModel } from '../../cotizacion/models/register.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;
  isSubmitting = false;
  feedbackMessage: string | null = null;
  feedbackType: 'success' | 'error' | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get firstName() {
    return this.registerForm.get('firstName');
  }

  get lastName() {
    return this.registerForm.get('lastName');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get username() {
    return this.registerForm.get('username');
  }

  get password() {
    return this.registerForm.get('password');
  }

  onSubmit(): void {
    this.submitted = true;
    this.feedbackMessage = null;
    this.feedbackType = null;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const payload: RegisterModel = this.registerForm.value;

    this.authService.register(
      payload.firstName,
      payload.lastName,
      payload.email,
      payload.username,
      payload.password
    ).subscribe({
      next: () => {
        this.feedbackMessage = 'Usuario registrado correctamente.';
        this.feedbackType = 'success';
        this.registerForm.reset();
        this.submitted = false;
        this.isSubmitting = false;
      },
      error: (error) => {
        this.feedbackMessage = 'No se pudo completar el registro. Verifica los datos o intenta más tarde.';
        this.feedbackType = 'error';
        console.error('Error al crear el usuario', error);
        this.isSubmitting = false;
      }
    });
  }
}
