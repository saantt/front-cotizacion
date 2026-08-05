import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatosRiesgoComponent } from './components/datos-riesgo/datos-riesgo.component';
import { DeducibleComponent } from './components/deducibles/deducibles.component';
import { TomadoresComponent } from './components/tomadores/tomadores.component';
import { MarcaVehiculoComponent } from './components/marca-vehiculo/marca-vehiculo.component';
import { CoverageComponent } from './components/coverages/coverage.component';
import { ImpuestoCotizacionComponent } from './components/impuesto-cotizacion/impuesto-cotizacion.component';
import { EstadoCotizacionComponent } from './components/estado-cotizacion/estado-cotizacion.component';
import { CoberturaRiesgoComponent } from './components/cobertura-riesgo/cobertura-riesgo.component';
import { LoginComponent } from '../shared/login/login.component';
import { AuthGuard } from '../core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'datos-riesgo', pathMatch: 'full' },
  { path: 'cobertura-riesgo', component: CoberturaRiesgoComponent, canActivate: [AuthGuard] },
  { path: 'datos-riesgo', component: DatosRiesgoComponent, canActivate: [AuthGuard] },
  { path: 'deducibles', component: DeducibleComponent, canActivate: [AuthGuard] },
  { path: 'tomadores', component: TomadoresComponent, canActivate: [AuthGuard] },
  { path: 'marcavehiculo', component: MarcaVehiculoComponent, canActivate: [AuthGuard] },
  { path: 'coberturas', component: CoverageComponent, canActivate: [AuthGuard] },
  { path: 'impuestos-cotizacion', component: ImpuestoCotizacionComponent, canActivate: [AuthGuard] },
  { path: 'estados-cotizacion', component: EstadoCotizacionComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CotizacionRoutingModule { }
