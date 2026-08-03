import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatosRiesgoComponent } from './components/datos-riesgo/datos-riesgo.component';
import { DeducibleComponent } from './components/deducibles/deducibles.component';
import { TomadoresComponent } from './components/tomadores/tomadores.component';

const routes: Routes = [
  { path: '', redirectTo: 'datos-riesgo', pathMatch: 'full' },
  { path: 'datos-riesgo', component: DatosRiesgoComponent },
  { path: 'deducibles', component: DeducibleComponent },
  { path: 'tomadores', component: TomadoresComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CotizacionRoutingModule { }
