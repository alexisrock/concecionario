import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventario',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.scss'
})
export class InventarioComponent implements OnInit {
  partForm: FormGroup;
  submitted = false;
  categories = ['Frenos', 'Filtros', 'Baterías', 'Aceite', 'Llantas', 'Suspensión', 'Motor'];
  concessionaires = ['Concesionario Norte', 'Concesionario Sur', 'Concesionario Este', 'Concesionario Oeste']; // Add concessionaires

  constructor(private fb: FormBuilder) {
    this.partForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(1)]],
      location: ['', Validators.required],
      concessionaire: ['', Validators.required] // Add concessionaire control
    });
  }

  ngOnInit() {
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.partForm.valid) {
      console.log(this.partForm.value);
      // Handle form submission here (e.g., send data to backend)
    } else {
      // Mark all form controls as touched to display validation errors
      Object.keys(this.partForm.controls).forEach(key => {
        this.partForm.get(key)?.markAsTouched();
      });
    }
  }

  get f() { return this.partForm.controls; }
}
