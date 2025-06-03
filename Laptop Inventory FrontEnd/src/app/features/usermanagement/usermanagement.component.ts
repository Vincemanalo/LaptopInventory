import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturesService } from '../features.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { AddempComponent } from '../../core/addemp/addemp.component';
import { UpdatesEmpComponent } from '../../core/updateemp/updateemp.component';
import { DeleteEmpComponent } from '../../core/deleteemp/deleteemp.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ModalinfoComponent } from '../../core/modalinfo_laptop/modalinfo.component';
import { MatInput } from '@angular/material/input';

interface Employee {
  employeeName: string;
  employmentDate: string;
  employmentPeriod: string;
}

@Component({
  selector: 'app-usermanagement',
  imports: [
    UpdatesEmpComponent,
    DeleteEmpComponent,
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    FormsModule,
    AddempComponent,
    MatPaginatorModule,
    ModalinfoComponent,
    MatInput,
    MatFormField
  ],
  templateUrl: './usermanagement.component.html',
  styleUrl: './usermanagement.component.css',
  standalone: true,
})
export class UserManagementComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'employeeName',
    'employmentDate',
    'employmentPeriod',
    'actions'
  ];

  dataSource = new MatTableDataSource<Employee>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  isModalOpen = false;
  isaddempModalOpen = false;
  iseditempModalOpen = false;
  isDeleteModalOpen = false;
  isModalInfoEmpOpen = false;
  selectedemployee: any = {};
  searchKeyword = '';
  pageNo = 1;
  pageSize = 10;
  totalRecords = 0;

  employeeMap: { [key: string]: string } = {};

  constructor(private FeaturesService: FeaturesService) { }

  ngOnInit(): void {
    this.getEmployees();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getEmployees(): void {
    this.FeaturesService.getAllEmployee(this.pageNo, this.pageSize, this.searchKeyword).subscribe(
      (response: any) => {
        // ✅ Sort using employmentDate
        const sortedEmployees = response.employees.sort(
          (a: Employee, b: Employee) =>
            new Date(b.employmentDate).getTime() - new Date(a.employmentDate).getTime()
        );
  
        this.dataSource.data = sortedEmployees;
        this.totalRecords = response.totalRecords;
        this.employeeMap = sortedEmployees.reduce((map: { [key: string]: string }, emp: Employee) => {
          map[emp.employeeName] = emp.employeeName;
          return map;
        }, {});
      },
      error => {
        console.error('Error fetching employees:', error);
      }
    );
  }
    
  onSearch(): void {
    this.pageNo = 1;
    this.getEmployees();
  }

  clearSearch(): void {
    this.searchKeyword = '';
    this.onSearch();
  }

  openModal(employee?: any): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  openModalInfoEmp(employee?: any): void {
    this.isModalInfoEmpOpen = true;
    this.selectedemployee = employee;
  }

  closeModalInfoEmp(): void {
    this.isModalInfoEmpOpen = false;
  }

  openeditempModal(employee?: any): void {
    this.iseditempModalOpen = true;
    this.selectedemployee = employee;
  }

  closeeditempModal(): void {
    this.iseditempModalOpen = false;
  }

  closeaddemp(): void {
    this.isaddempModalOpen = false;
    this.getEmployees();
  }

  openDeleteEmpModal(employee?: any): void {
    this.isDeleteModalOpen = true;
    this.selectedemployee = employee;
  }

  closeDeleteEmpModal(): void {
    this.isDeleteModalOpen = false;
  }

  getEmployeeName(_id: string): string {
    return this.employeeMap[_id] || 'Unknown';
  }

  onPageChange(event: any): void {
    this.pageNo = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getEmployees();
  }
  
}
