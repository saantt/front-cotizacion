import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeducibleComponent } from './components/deducibles/deducibles.component';

const routes: Routes = [
  {path: '', component: DeducibleComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CotizacionRoutingModule { }
