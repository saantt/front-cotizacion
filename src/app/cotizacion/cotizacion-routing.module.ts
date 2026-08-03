import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatosRiesgoComponent } from './components/datos-riesgo/datos-riesgo.component';
import { DeduciblesComponent } from './components/deducibles/deducibles.component';

const routes: Routes = [
  { path: '', redirectTo: 'datos-riesgo', pathMatch: 'full' },
  { path: 'datos-riesgo', component: DatosRiesgoComponent },
  { path: 'deducibles', component: DeduciblesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CotizacionRoutingModule { }
