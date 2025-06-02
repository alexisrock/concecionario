import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empleado',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './empleado.component.html',
  styleUrl: './empleado.component.scss'
})
export class EmpleadoComponent  {
  employeeForm: FormGroup;
  concessionaires = ['Concesionario Norte', 'Concesionario Sur', 'Concesionario Este', 'Concesionario Oeste'];

  constructor(private readonly fb: FormBuilder) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      position: ['', Validators.required],
      concessionaire: ['', Validators.required]
    });
  }



  onSubmit(): void {
    if (this.employeeForm.valid) {
      console.log(this.employeeForm.value);
      // Here you would typically send the data to your backend service
    } else {
      // Trigger form validation to display errors
      Object.values(this.employeeForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }
}
