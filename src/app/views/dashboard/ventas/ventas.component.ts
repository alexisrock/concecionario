import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackendService, SaleRecord } from '../../../services/backend.service';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {

  salesRecords: SaleRecord[] = [];

  constructor(private readonly backendService: BackendService) { }

  ngOnInit(): void {
    this.backendService.getSalesRecords().subscribe(data => {
      this.salesRecords = data;
    });
  }

}
