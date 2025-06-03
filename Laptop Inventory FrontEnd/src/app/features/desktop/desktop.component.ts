import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ModalDesktopComponent } from '../../core/modaldesktop/modaldesktop.component';
import { CommonModule } from '@angular/common';
import { FeaturesService } from '../features.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { UpdatesComponent } from '../../core/updates/updates.component';
import { DeleteComponent } from '../../core/delete/delete.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Modalinfo_desktopComponent } from '../../core/modalinfo-desktop/modalinfo-desktop.component';
import { DeleteDesktopComponent } from '../../core/delete-desktop/delete-desktop.component';
import { UpdatesDesktopComponent } from '../../core/updates-desktop/updates-desktop.component';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

interface Desktop {
  desktopName: string;
  desktopSerialNumber: string;
  desktopModel: string;
  desktopRam: string;
  desktopStorage: string;
  desktopPurchaseDate: Date;
  desktopLocation: string;
  desktopAssignedTo: string;
  desktopCondition: string;
}

@Component({
  selector: 'app-desktop',
  imports: [
    ModalDesktopComponent,
    UpdatesDesktopComponent,
    DeleteDesktopComponent,
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    FormsModule,
    MatPaginatorModule,
    Modalinfo_desktopComponent,
    MatFormField,
    MatInput
  ],
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.css'],
  standalone: true,
})
export class DesktopComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'desktopName',
    'desktopSerialNumber',
    'desktopPurchaseDate',
    'desktopLocation',
    'desktopAssignedTo',
    'desktopCondition',
    'actions',
  ];

  desktop = new MatTableDataSource<Desktop>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  isModalOpen = false;
  isModalinfoOpen = false;
  isEditModalOpen = false;
  isDeleteModalOpen = false;
  searchKeyword = '';
  pageNo = 1;
  pageSize = 10;
  totalRecords = 0;
  selectedDesktop: Desktop | null = null;

  employees: any[] = [];
  employeeMap: { [key: string]: string } = {};

  constructor(private FeaturesService: FeaturesService) {}

  ngOnInit(): void {
    this.getEmployees();
    this.getDesktops();
  }

  ngAfterViewInit(): void {
    this.desktop.paginator = this.paginator;
  }

  getDesktops(): void {
    this.FeaturesService.getAllDesktop(this.pageNo, this.pageSize, this.searchKeyword).subscribe({
      next: (response) => {
        if (response && response.desktop) {
          this.desktop.data = response.desktop.sort(
            (a: Desktop, b: Desktop) =>
              new Date(b.desktopPurchaseDate).getTime() - new Date(a.desktopPurchaseDate).getTime()
          );
          this.totalRecords = response.totalRecords ?? response.desktop.length;
        } else {
          this.desktop.data = [];
          this.totalRecords = 0;
        }
      },
      error: (error) => console.error('Error fetching desktops:', error),
    });
  }

  getEmployees(): void {
    this.FeaturesService.getAllEmployee().subscribe({
      next: (response) => {
        const employeeArray = response?.employees ?? [];
        this.employees = employeeArray;
        this.employeeMap = employeeArray.reduce(
          (map: { [key: string]: string }, employee: { _id: string; employeeName: string }) => {
            map[employee._id] = employee.employeeName;
            return map;
          },
          {}
        );
      },
      error: (error) => console.error('Error fetching employees:', error),
    });
  }

  getEmployeeName(_id: string): string {
    return this.employeeMap[_id] || 'Unknown';
  }

  // Add Modal
  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.getDesktops();
  }

  // Info Modal
  openModalinfo(desktop: Desktop): void {
    this.selectedDesktop = desktop;
    this.isModalinfoOpen = true;
  }

  closeModalinfo(): void {
    this.isModalinfoOpen = false;
    this.selectedDesktop = null;
  }

  // Edit Modal
  openEditModal(desktop: Desktop): void {
    this.selectedDesktop = desktop;
    this.isEditModalOpen = true;
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
  }

  // Delete Modal
  openDeleteModal(desktop: Desktop): void {
    this.selectedDesktop = desktop;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
  }

  // Search & Pagination
  onSearch(): void {
    this.pageNo = 1;
    this.getDesktops();
  }

  clearSearch(): void {
    this.searchKeyword = '';
    this.onSearch();
  }

  onPageChange(event: any): void {
    this.pageNo = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getDesktops();
  }
}
