import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '',redirectTo: '',pathMatch: 'full'},
  { path: 'deducibles', loadChildren: () => import('./cotizacion/cotizacion.module').then(m => m.CotizacionModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
