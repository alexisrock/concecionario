import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { BackendService, Employee } from '../../../services/backend.service';
import { EmpleadoComponent } from "../empleado/empleado.component";

@Component({
  selector: 'app-listempleados',
  standalone: true,
  imports: [CommonModule, EmpleadoComponent],
  templateUrl: './listempleados.component.html',
  styleUrl: './listempleados.component.scss'
})
export class ListempleadosComponent implements OnInit {

  employees: Employee[] = [];

  constructor(private backendService: BackendService) { }

  ngOnInit(): void {
    this.backendService.getEmployees().subscribe(data => {
      this.employees = data;
    });
  }

}
