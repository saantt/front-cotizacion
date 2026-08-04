import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CotizacionRoutingModule } from './cotizacion-routing.module';
import { DeducibleComponent } from './components/deducibles/deducibles.component';
import { DatosRiesgoComponent } from './components/datos-riesgo/datos-riesgo.component';
import { FormDatosRiesgoComponent } from './components/datos-riesgo/form-datos-riesgo/form-datos-riesgo.component';
import { ListDatosRiesgosComponent } from './components/datos-riesgo/list-datos-riesgo/list-datos-riesgo.component';
import { TomadoresComponent } from './components/tomadores/tomadores.component';
import { MarcaVehiculoComponent } from './components/marca-vehiculo/marca-vehiculo.component';
import { CoverageComponent } from './components/coverages/coverage.component';
import { ImpuestoCotizacionComponent } from './components/impuesto-cotizacion/impuesto-cotizacion.component';
import { EstadoCotizacionComponent } from './components/estado-cotizacion/estado-cotizacion.component';
<<<<<<< HEAD
import { CoberturaRiesgoComponent } from './components/cobertura-riesgo/cobertura-riesgo.component';
=======
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
>>>>>>> 418f95a48e297a66f3737694f7695742771fd2ff

@NgModule({
  declarations: [
    DeducibleComponent,
    CoberturaRiesgoComponent,
    DatosRiesgoComponent,
    FormDatosRiesgoComponent,
    ListDatosRiesgosComponent,
    TomadoresComponent,
    MarcaVehiculoComponent,
    CoverageComponent,
    ImpuestoCotizacionComponent,
    EstadoCotizacionComponent
  ],
  imports: [
    CommonModule,
    CotizacionRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCardModule,

  ],
  exports: [
    CoberturaRiesgoComponent,
    DatosRiesgoComponent,
    TomadoresComponent,
    DeducibleComponent,
    MarcaVehiculoComponent,
    CoverageComponent,
    ImpuestoCotizacionComponent,
    EstadoCotizacionComponent
  ]
})
export class CotizacionModule { }
