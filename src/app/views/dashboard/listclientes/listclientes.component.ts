import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackendService, Customer } from '../../../services/backend.service';
import { ClienteComponent } from '../cliente/cliente.component';

@Component({
  selector: 'app-listclientes',
  imports: [CommonModule, ClienteComponent],
  templateUrl: './listclientes.component.html',
  styleUrl: './listclientes.component.scss'
})
export class ListclientesComponent implements OnInit, AfterViewInit, OnDestroy {
  customers: Customer[] = [];
  @ViewChild('clienteModal') clienteModal!: ElementRef ;
  private modalElement: any;

  constructor(private readonly backendService: BackendService) { }

  ngOnInit(): void {
    this.backendService.getCustomers().subscribe(data => {
      this.customers = data;
    });
  }

  ngAfterViewInit(): void {
    this.modalElement = document.getElementById('clienteModal');

    this.modalElement.addEventListener('hidden.bs.modal', () => {
      const focusTarget = document.getElementById('newCustomerButton');

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
}
