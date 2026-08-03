import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CotizacionRoutingModule } from './cotizacion-routing.module';
import { DeducibleComponent } from './components/deducibles/deducibles.component';
import { TomadoresComponent } from './components/tomadores/tomadores.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    DeducibleComponent,
    TomadoresComponent
  ],
  imports: [
    CommonModule,
    CotizacionRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  exports: [
    TomadoresComponent,
    DeducibleComponent
  ]
})
export class CotizacionModule { }
