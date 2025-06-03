import { Component, OnInit } from '@angular/core';
import { ModalComponent } from '../../core/modallaptop/modal.component';
import { CommonModule } from '@angular/common';
import { FeaturesService } from '../features.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { UpdatesComponent } from '../../core/updates/updates.component';
import { DeleteComponent } from '../../core/delete/delete.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ModalinfoComponent } from '../../core/modalinfo_laptop/modalinfo.component';
import { MatInput } from '@angular/material/input';

interface Laptop {
  laptopName: string;
  laptopSerialNumber: string;
  laptopDescription: string;
  laptopPurchaseDate: Date;
  laptopAssignedTo: string;
  laptopCondition: string;
  totalDurationOnGranting: string;
}

@Component({
  selector: 'app-laptop',
  imports: [
    ModalComponent,
    UpdatesComponent,
    DeleteComponent,
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    FormsModule,
    MatPaginatorModule,
    ModalinfoComponent,
    MatFormField,
    MatInput,
    MatPaginator
  ],
  templateUrl: './laptop.component.html',
  styleUrls: ['./laptop.component.css'],
  standalone: true,
})
export class LaptopComponent implements OnInit {
  displayedColumns: string[] = [
    'laptopName',
    'laptopSerialNumber',
    'laptopDescription',
    'laptopPurchaseDate',
    'totalDurationOnGranting',
    'laptopAssignedTo',
    'laptopCondition',
    'actions',
  ];

  laptops: Laptop[] = [];
  isModalOpen = false;
  isModalinfoOpen = false;
  isEditModalOpen = false;
  isDeleteModalOpen = false;
  searchKeyword = '';
  pageNo = 1;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 1;
  isEditMode: any;
  selectedLaptop: Laptop | null = null;

  employees: any[] = [];
  employeeMap: { [key: string]: string } = {};

  constructor(private FeaturesService: FeaturesService) {}

  ngOnInit(): void {
    this.getEmployees();
    this.getLaptops();
  }

  getLaptops(): void {
    this.FeaturesService.getAllLaptop(this.pageNo, this.pageSize, this.searchKeyword).subscribe({
      next: (response) => {
        if (response && response.laptops) {
          this.laptops = response.laptops.sort(
            (a: Laptop, b: Laptop) =>
              new Date(b.laptopPurchaseDate).getTime() - new Date(a.laptopPurchaseDate).getTime()
          );
          this.totalRecords = response.totalRecords;
        } else {
          this.laptops = [];
          this.totalRecords = 0;
        }
      },
      error: (error) => console.error('Error fetching laptops:', error),
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

  filterLaptops(laptop: Laptop): boolean {
    if (!this.searchKeyword.trim()) return true;
    const keyword = this.searchKeyword.trim().toLowerCase();
    return (
      laptop.laptopName.toLowerCase().includes(keyword) ||
      laptop.laptopSerialNumber.toLowerCase().includes(keyword) ||
      laptop.laptopDescription.toLowerCase().includes(keyword) ||
      laptop.laptopPurchaseDate.toString().toLowerCase().includes(keyword) ||
      laptop.totalDurationOnGranting.toLowerCase().includes(keyword) ||
      laptop.laptopAssignedTo.toLowerCase().includes(keyword) ||
      laptop.laptopCondition.toLowerCase().includes(keyword)
    );
  }

  // Add Modal
  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.getLaptops();
  }

  // Info Modal
  openModalinfo(laptop: Laptop): void {
    this.selectedLaptop = laptop;
    this.isModalinfoOpen = true;
  }

  closeModalinfo(): void {
    this.isModalinfoOpen = false;
    this.selectedLaptop = null;
  }

  // Edit Modal
  openEditModal(laptop: Laptop): void {
    this.selectedLaptop = laptop;
    this.isEditModalOpen = true;
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
  }

  // Delete Modal
  openDeleteModal(laptop: Laptop): void {
    this.selectedLaptop = laptop;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
  }

  // Search & Pagination
  onSearch(): void {
    this.pageNo = 1;
    this.getLaptops();
  }

  clearSearch(): void {
    this.searchKeyword = '';
    this.onSearch();
  }

  onPageChange(event: any): void {
    this.pageNo = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getLaptops();
  }
}
