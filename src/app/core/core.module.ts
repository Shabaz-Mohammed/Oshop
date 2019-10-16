import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from 'app/core/components/login/login.component';
import { SharedModule } from 'shared/shared.module';

import { BsNavbarComponent } from './components/bs-navbar/bs-navbar.component';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([])],
  declarations: [BsNavbarComponent, HomeComponent, LoginComponent],
  exports: [BsNavbarComponent]
})
export class CoreModule {}
