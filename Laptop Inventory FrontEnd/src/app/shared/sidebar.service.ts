import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private sidenav!: MatSidenav;

  public setSidenav(sidenav: MatSidenav) {
    this.sidenav = sidenav;
  }

  public close(): void {
    this.sidenav?.close();
  }

  public toggle(): void {
    this.sidenav?.toggle();
  }
}
