import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { FeaturesService } from '../../features/features.service';

@Component({
  selector: 'app-modalinfo',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTableModule],
  templateUrl: './modalinfo.component.html',
  styleUrls: ['./modalinfo.component.css'],
})
export class ModalinfoComponent implements OnInit {
  @Input() selectedLaptop: any;
  @Output() closeModalEvent = new EventEmitter<void>();
  isModalOpen = true;

  employeeMap: { [key: string]: string } = {};
  displayedColumns: string[] = [
    'laptopName',
    'laptopSerialNumber',
    'laptopDescription',
    'laptopPurchaseDate',
    'laptopLocation',
    'laptopAssignedTo',
    'laptopAge',
    'LaptopsGranted',
    'totalDuration',
    'totalDurationOnGranting',
    'laptopCondition',
  ];

  constructor(private featuresService: FeaturesService) {}

  ngOnInit(): void {
    this.getEmployees();
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.closeModalEvent.emit();
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
}
