import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatosRiesgoComponent } from './components/datos-riesgo/datos-riesgo.component';
import { DeducibleComponent } from './components/deducibles/deducibles.component';
import { TomadoresComponent } from './components/tomadores/tomadores.component';
import { MarcaVehiculoComponent } from './components/marca-vehiculo/marca-vehiculo.component';

const routes: Routes = [
  { path: '', redirectTo: 'datos-riesgo', pathMatch: 'full' },
  { path: 'datos-riesgo', component: DatosRiesgoComponent },
  { path: 'deducibles', component: DeducibleComponent },
  { path: 'tomadores', component: TomadoresComponent },
  { path: 'marcavehiculo', component: MarcaVehiculoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CotizacionRoutingModule { }
