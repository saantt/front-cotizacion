import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CotizacionRoutingModule } from './cotizacion-routing.module';
import { DeduciblesComponent } from './components/deducibles/deducibles.component';
import { MarcaVehiculoComponent } from './components/marca-vehiculo/marca-vehiculo.component';

@NgModule({
  declarations: [
    DeduciblesComponent,
    MarcaVehiculoComponent
  ],
  imports: [
    CommonModule,
    CotizacionRoutingModule,
    ReactiveFormsModule
  ],
  exports: [
    MarcaVehiculoComponent
  ]
})
export class CotizacionModule { }
