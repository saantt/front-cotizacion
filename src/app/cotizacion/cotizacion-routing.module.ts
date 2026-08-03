import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatosRiesgoComponent } from './components/datos-riesgo/datos-riesgo.component';
import { DeducibleComponent } from './components/deducibles/deducibles.component';
import { TomadoresComponent } from './components/tomadores/tomadores.component';
import { MarcaVehiculoComponent } from './components/marca-vehiculo/marca-vehiculo.component';
import { CoverageComponent } from './components/coverages/coverage.component';
import { ImpuestoCotizacionComponent } from './components/impuesto-cotizacion/impuesto-cotizacion.component';

const routes: Routes = [
  { path: '', redirectTo: 'datos-riesgo', pathMatch: 'full' },
  { path: 'datos-riesgo', component: DatosRiesgoComponent },
  { path: 'deducibles', component: DeducibleComponent },
  { path: 'tomadores', component: TomadoresComponent },
  { path: 'marcavehiculo', component: MarcaVehiculoComponent },
  { path: 'coberturas', component: CoverageComponent },
  { path: 'impuestos-cotizacion', component: ImpuestoCotizacionComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CotizacionRoutingModule { }
