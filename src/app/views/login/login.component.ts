import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BackendService } from '../../services/backend.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup;
  isLoading = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly backendService: BackendService
  ) {
    this.ngOnInit();
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;

      this.backendService.login(this.loginForm.value).subscribe({
        next: (response) => {
console.log('Login response:', response);
          if (response.success) {
            this.router.navigateByUrl('dashboard');
          }
        },
        error: (error) => {
          console.error('Login error:', error);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
}
