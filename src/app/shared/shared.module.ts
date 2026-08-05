import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from './menu/menu.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [MenuComponent, LoginComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  exports: [
    MenuComponent,
    LoginComponent
  ]
})
export class SharedModule { }