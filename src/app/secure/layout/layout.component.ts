import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  isSidebarOpen = true;
  /*
  menuItems = [
    { name: 'Dashboard', link: '/contacts', icon: 'fas fa-home' },
    { name: 'Settings', link: '/settings', icon: 'fas fa-cog' },
    // Ajoutez d'autres éléments de menu ici
  ];

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  */
}
