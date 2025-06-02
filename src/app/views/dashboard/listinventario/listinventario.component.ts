import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BackendService, VehiclePart } from '../../../services/backend.service';
import { InventarioComponent } from '../inventario/inventario.component';

@Component({
  selector: 'app-listinventario',
  standalone: true,
  imports: [CommonModule, FormsModule, InventarioComponent],
  templateUrl: './listinventario.component.html',
  styleUrl: './listinventario.component.scss'
})
export class ListinventarioComponent implements OnInit, AfterViewInit, OnDestroy {
  parts: VehiclePart[] = [];
  newPart: Omit<VehiclePart, 'id'> = {
    name: '',
    category: '',
    stock: 0,
    price: 0,
    location: '',
    concessionaire: ''
  };
  categories = ['Frenos', 'Filtros', 'Baterías', 'Aceite', 'Llantas', 'Suspensión', 'Motor'];
  @ViewChild('inventarioModal') inventarioModal!: ElementRef;
  private  modalElement: any;

  constructor(private readonly backendService: BackendService) {}

  ngOnInit() {
    this.loadParts();
  }

  ngAfterViewInit(): void {
    this.modalElement = document.getElementById('inventarioModal');

    this.modalElement.addEventListener('hidden.bs.modal', () => {
      const focusTarget = document.getElementById('newProductButton');

      if (focusTarget) {
        (focusTarget as HTMLButtonElement).focus();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.modalElement) {
      this.modalElement.removeEventListener('hidden.bs.modal', () => {});
    }
  }

  loadParts() {
    this.backendService.getVehicleParts().subscribe(parts => {
      this.parts = parts;
    });
  }

  addPart() {
    if (this.newPart.name && this.newPart.category && this.newPart.stock > 0) {
      this.backendService.addVehiclePart(this.newPart).subscribe(() => {
        this.loadParts();
        this.resetForm();
      });
    }
  }

  resetForm() {
    this.newPart = {
      name: '',
      category: '',
      stock: 0,
      price: 0,
      location: '',
      concessionaire: ''

    };
  }
}
