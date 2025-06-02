import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { InitialComponent } from './initial/initial.component';
import { ListinventarioComponent } from './listinventario/listinventario.component';
import { ListclientesComponent } from './listclientes/listclientes.component';
import { AdministracionComponent } from './administracion/administracion.component';
import { VentasComponent } from './ventas/ventas.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { ListempleadosComponent } from './listempleados/listempleados.component';

export const routes: Routes = [
  { path: '',

    children: [
      { path: '', component: InitialComponent},
      { path: 'inventario', component: ListinventarioComponent},
      { path: 'clientes', component: ListclientesComponent},
      { path: 'administracion', component: AdministracionComponent},
      { path: 'ventas', component: VentasComponent},
      { path: 'categorias', component: CategoriasComponent},
      { path: 'empleados', component: ListempleadosComponent},




    ]},
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class DashboardModule { }
