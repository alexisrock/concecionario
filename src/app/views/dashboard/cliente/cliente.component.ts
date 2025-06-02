import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.scss'
})
export class ClienteComponent   {
  customerForm: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.customerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    });
  }



  onSubmit(): void {
    if (this.customerForm.valid) {
      console.log(this.customerForm.value);
      // Here you would typically send the data to your backend service
    } else {
      // Trigger form validation to display errors
      Object.values(this.customerForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }
}
