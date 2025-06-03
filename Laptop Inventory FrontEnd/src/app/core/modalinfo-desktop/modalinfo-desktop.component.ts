import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FeaturesService } from '../../features/features.service';

interface Desktop {
  desktopName: string;
  desktopSerialNumber: string;
  desktopModel: string;
  desktopProcessor: string;
  desktopRam: string;
  desktopStorage: string;
  desktopPurchaseDate: Date;
  desktopLocation: string;
  desktopAssignedTo: string;
  desktopCondition: string;
}

@Component({
  selector: 'app-modalinfo-desktop',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
  ],
  templateUrl: './modalinfo-desktop.component.html',
  styleUrls: ['./modalinfo-desktop.component.css'],
})
export class Modalinfo_desktopComponent implements OnInit {
  @Input() selectedDesktop: any;
  @Output() closeModalEvent = new EventEmitter<void>();
  isModalOpen = true;

  displayedColumns: string[] = [
    'desktopName',
    'desktopSerialNumber',
    'desktopModel',
    'desktopProcessor',
    'desktopRam',
    'desktopStorage',
    'desktopPurchaseDate',
    'desktopLocation',
    'desktopAssignedTo',
    'desktopCondition',
  ];

  desktops: Desktop[] = [];
  paginatedDesktops: Desktop[] = [];
  employeeMap: { [key: string]: string } = {};

  pageSize = 10;
  totalDesktops = 0;

  constructor(private featuresService: FeaturesService) {}

  ngOnInit(): void {
    this.getEmployees();
    this.getDesktops();
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.closeModalEvent.emit();
  }

  getDesktops(): void {
    this.featuresService.getAllDesktop().subscribe({
      next: (response: { desktop: Desktop[] }) => {
        if (response && response.desktop) {
          this.desktops = response.desktop;
          this.totalDesktops = this.desktops.length;
          this.paginatedDesktops = this.desktops.slice(0, this.pageSize);
        } else {
          this.desktops = [];
          this.paginatedDesktops = [];
          this.totalDesktops = 0;
        }
      },
      error: (error: any) => console.error('Error fetching desktops:', error),
    });
  }

  getEmployees(): void {
    this.featuresService.getAllEmployee().subscribe({
      next: (response: { employees: any[] }) => {
        const employeeArray = response?.employees ?? [];
        this.employeeMap = employeeArray.reduce(
          (map: { [key: string]: string }, employee: { _id: string; employeeName: string }) => {
            map[employee._id] = employee.employeeName;
            return map;
          },
          {}
        );
      },
      error: (error: any) => console.error('Error fetching employees:', error),
    });
  }

  getEmployeeName(_id: string): string {
    return this.employeeMap[_id] || 'Unknown';
  }

  onPageChange(event: any): void {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.paginatedDesktops = this.desktops.slice(startIndex, endIndex);
  }
}
