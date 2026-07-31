import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CotizacionRoutingModule } from './cotizacion-routing.module';
import { DeducibleComponent } from './components/deducibles/deducibles.component';

@NgModule({
  declarations: [
    DeducibleComponent
  ],
  imports: [
    CommonModule,
    CotizacionRoutingModule,
    ReactiveFormsModule
  ],
  exports: [
    DeducibleComponent 
  ]
})
export class CotizacionModule { }
