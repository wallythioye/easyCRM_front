import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SecureRoutingModule } from './secure-routing.module';
import { LayoutComponent } from "./layout/layout.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { ContactsComponent } from "./pages/contacts/contacts.component";
import { FacturesComponent } from "./pages/factures/factures.component";
import { OpportunitesComponent } from './pages/opportunites/opportunites.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EtapeComponent } from './pages/etape/etape.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from '../core/interceptors/token.interceptor';
import { LigneFactureComponent } from './pages/ligne-facture/ligne-facture.component';
import { ModelFactureComponent } from './pages/model-facture/model-facture.component';
import { MdpasseComponent } from '../public/pages/mdpasse/mdpasse.component';
import { ResetPasswordComponent } from '../public/pages/reset-password/reset-password.component';

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  declarations: [
    LayoutComponent,
    SidebarComponent,
    NavbarComponent,
    ContactsComponent,
    FacturesComponent,
    OpportunitesComponent,
    EtapeComponent,
    LigneFactureComponent,
    ModelFactureComponent,
    MdpasseComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    SecureRoutingModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule 
  ],
  exports: [
    NavbarComponent,
    SidebarComponent
  ]
})
export class SecureModule { }
