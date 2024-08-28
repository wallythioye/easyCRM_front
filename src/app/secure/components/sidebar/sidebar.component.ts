import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  isOpen= true;

  constructor(private authService: AuthService){

  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  logout() {

    this.authService.logout(); 
      }
}
