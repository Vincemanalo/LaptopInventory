import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';

import { FeaturesService } from '../features.service';
import { ModalserverComponent } from '../../core/modalserver/modalserver.component';
import { UpdateServerComponent } from '../../core/update-server/update-server.component';
import { DeleteServerComponent } from '../../core/delete-server/delete-server.component';
import { ModalinfoServerComponent } from '../../core/modalinfo-server/modalinfo-server.component';

interface Server {
  _id?: string;
  serverName: string;
  serverSerialNumber: string;
  serverOs: string;
  serverProcessor: string;
  serverRam: string;
  serverPurchaseDate: Date;
  serverLocation: string;
  serverCondition: string;
  inspectedBy: string;
}

@Component({
  selector: 'app-server-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    MatInputModule,
    MatPaginatorModule,
    ModalserverComponent,
    UpdateServerComponent,
    DeleteServerComponent,
    ModalinfoServerComponent, //
  ],
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.css'],
})
export class ServerComponent implements OnInit {
  displayedColumns: string[] = [
    'serverName',
    'serverSerialNumber',
    'serverOs',
    'serverPurchaseDate',
    'serverLocation',
    'serverCondition',
    'inspectedBy',
    'actions',
  ];

  servers: Server[] = [];
  filteredServers: Server[] = [];
  isModalOpen = false;
  isEditModalOpen = false;
  isDeleteModalOpen = false;
  isInfoModalOpen = false; // ✅ For info modal
  selectedServer: Server | null = null;

  searchKeyword = '';
  pageNo = 1;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 1;

  constructor(private featuresService: FeaturesService) {}

  ngOnInit(): void {
    this.getServers();
  }

  getServers(): void {
    this.featuresService.getAllServer(this.pageNo, this.pageSize).subscribe({
      next: (response) => {
        console.log('API Response:', response);
        if (response && response.server) {
          // Sort by latest serverPurchaseDate
          this.servers = response.server.sort(
            (a: Server, b: Server) =>
              new Date(b.serverPurchaseDate).getTime() - new Date(a.serverPurchaseDate).getTime()
          );
                    this.filteredServers = this.servers.filter(server => this.filterServers(server));
          this.totalRecords = response.totalRecords;
          this.totalPages = response.totalPages;
        } else {
          this.servers = [];
          this.filteredServers = [];
        }
        console.log('Filtered Servers:', this.filteredServers);
      },
      error: (error) => console.error('Error fetching servers:', error),
    });
  }
  
  filterServers(server: Server): boolean {
    if (!this.searchKeyword.trim()) return true;
    const keyword = this.searchKeyword.trim().toLowerCase();
    return (
      server.serverName.toLowerCase().includes(keyword) ||
      server.serverSerialNumber.toLowerCase().includes(keyword) ||
      server.serverOs.toLowerCase().includes(keyword) ||
      server.serverProcessor.toLowerCase().includes(keyword) ||
      server.serverRam.toLowerCase().includes(keyword) ||
      server.serverLocation.toLowerCase().includes(keyword) ||
      server.serverCondition.toLowerCase().includes(keyword) ||
      server.inspectedBy.toLowerCase().includes(keyword) ||
      server.serverPurchaseDate.toString().toLowerCase().includes(keyword)
    );
  }

  openModal(server?: Server) {
    this.isModalOpen = true;
    this.selectedServer = server || null;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedServer = null;
    this.getServers();
  }

  openEditModal(server: Server) {
    this.isEditModalOpen = true;
    this.selectedServer = server;
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.selectedServer = null;
    this.getServers();
  }

  openDeleteModal(server: Server) {
    this.isDeleteModalOpen = true;
    this.selectedServer = server;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.selectedServer = null;
    this.getServers();
  }

  // ✅ Info Modal Logic
  openInfoModal(server: Server): void {
    console.log('Info button clicked');
    this.isInfoModalOpen = true;
    this.selectedServer = server;
  }

  closeInfoModal(): void {
    this.isInfoModalOpen = false;
    this.selectedServer = null;
  }

  onSearch(): void {
    this.pageNo = 1;
    this.getServers();
  }

  clearSearch(): void {
    this.searchKeyword = '';
    this.pageNo = 1;
    this.getServers();
  }

  onPageChange(event: any): void {
    this.pageNo = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getServers();
  }
}
