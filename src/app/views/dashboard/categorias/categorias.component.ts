import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { BackendService, Category } from '../../../services/backend.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss']
})
export class CategoriasComponent implements OnInit {

  categories: Category[] = [];

  constructor(private backendService: BackendService) { }

  ngOnInit(): void {
    this.backendService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

}
