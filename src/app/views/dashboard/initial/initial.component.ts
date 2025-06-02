import { Component, OnInit, OnDestroy, ViewChildren, ElementRef, QueryList, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { BackendService } from '../../../services/backend.service';

@Component({
  selector: 'app-initial',
  templateUrl: './initial.component.html',
  styleUrls: ['./initial.component.scss']
})
export class InitialComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('chartCanvas') chartCanvases!: QueryList<ElementRef<HTMLCanvasElement>>;
  private charts: Chart[] = [];

  constructor(private readonly backendService: BackendService) {}

  ngOnInit() {
    this.loadCharts();
  }

  ngAfterViewInit() {
    // Canvas references are available here
    this.chartCanvases.changes.subscribe(() => {
      this.loadCharts();
    });
  }

  ngOnDestroy() {
    this.destroyCharts();
  }

  private loadCharts() {
    this.backendService.getSalesData().subscribe(data => {
      this.destroyCharts();

      const canvasElements = this?.chartCanvases?.toArray();
      const [partsCanvas, sellersCanvas, monthlyCanvas] = canvasElements;

      if (partsCanvas) this.createPartsChart(partsCanvas.nativeElement, data.parts);
      if (sellersCanvas) this.createSellersChart(sellersCanvas.nativeElement, data.sellers);
      if (monthlyCanvas) this.createMonthlyChart(monthlyCanvas.nativeElement, data.monthlySales);
    });
  }

  private destroyCharts() {
    this.charts.forEach(chart => chart.destroy());
    this.charts = [];
  }

  private createPartsChart(canvas: HTMLCanvasElement, parts: any[]) {
    const chart = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: parts.map(part => part.name),
        datasets: [{
          data: parts.map(part => part.quantity),
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
          ]
        }]
      }
    });
    this.charts.push(chart);
  }

  private createSellersChart(canvas: HTMLCanvasElement, sellers: any[]) {
    const chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: sellers.map(seller => seller.name),
        datasets: [{
          label: 'Ventas ($)',
          data: sellers.map(seller => seller.sales),
          backgroundColor: '#36A2EB'
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    this.charts.push(chart);
  }

  private createMonthlyChart(canvas: HTMLCanvasElement, monthlySales: any[]) {
    const chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: monthlySales.map(sale => sale.month),
        datasets: [{
          label: 'Ventas Mensuales ($)',
          data: monthlySales.map(sale => sale.total),
          borderColor: '#4BC0C0',
          tension: 0.1
        }]
      }
    });
    this.charts.push(chart);
  }
}
