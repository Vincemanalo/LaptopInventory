import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SidebarService } from '../../shared/sidebar.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { Route, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatExpansionModule,
    RouterModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  headerTitle = 'Dashboard';
  isSidenavOpen = true;
  isMobile = window.innerWidth <= 768;

  constructor(
    private sidebarService: SidebarService,
    private router: Router // ✅ inject the Router here
  ) {}
  

  ngAfterViewInit(): void {
    this.sidebarService.setSidenav(this.sidenav);
  }

  toggleSidenav(): void {
    this.sidebarService.toggle();
  }

  onBackdropClick(): void {
    this.isSidenavOpen = false;
  }

  onContentClick(): void {
    if (this.isMobile) {
      this.sidebarService.close();
    }
  }

  logout(): void {
    this.sidebarService.close();
  
    localStorage.clear();
    sessionStorage.clear();
  
    this.router.navigate(['/login']);
  }
  }
