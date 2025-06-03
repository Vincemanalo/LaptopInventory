import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturesService } from '../features.service';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

interface LaptopDashboard {
  employeeName: string;
  purchaseDate: string;
  laptopAge: string;
  laptopsGranted: number;
  condition: string;
}

interface StatData {
  count: number;
  label: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    FormsModule,
    MatInputModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

  displayedColumns: string[] = [
    'employeeName',
    'purchaseDate',
    'laptopAge',
    'condition',
    'laptopsGranted'
  ];

  laptops: LaptopDashboard[] = [];
  StatsCards: StatData[] = [
    { count: 0, label: 'Total Laptops' },
    { count: 0, label: 'Total Employees' },
    { count: 0, label: 'Total Desktops' },
    { count: 0, label: 'Total Servers' },
  ];

  employees: { _id: string, employeeName: string }[] = [];
  employeeMap: { [key: string]: string } = {};

  isSidebarOpen = false;
  latestPurchaseDate: string = '';

  constructor(private featuresService: FeaturesService) {}

  ngOnInit(): void {
    this.getEmployees();
    this.getLaptops();
    this.getDesktops();
    this.getServers(); // <-- Added this line
  }

  handleSidebarToggle(isOpen: boolean): void {
    this.isSidebarOpen = isOpen;
  }

  getEmployees(): void {
    this.featuresService.getAllEmployee().subscribe({
      next: (response) => {
        if (response && response.employees) {
          this.employees = response.employees;
          this.employeeMap = this.employees.reduce((acc, employee) => {
            acc[employee._id] = employee.employeeName;
            return acc;
          }, {} as { [key: string]: string });

          this.StatsCards[1].count = response.employeeCount ?? 0;
        } else {
          this.employees = [];
          this.StatsCards[1].count = 0;
        }
      },
      error: (error) => {
        console.error('Error fetching employees:', error);
      }
    });
  }

  getLaptops(): void {
    this.featuresService.getAllLaptop().subscribe({
      next: (response) => {
        console.log('Laptop API Response:', response);

        if (response && response.laptops) {
          this.laptops = response.laptops.map((laptop: any) => ({
            employeeName: this.employeeMap[laptop.laptopAssignedTo] || 'Unknown',
            purchaseDate: laptop.laptopPurchaseDate,
            laptopAge: laptop.laptopAge,
            condition: laptop.laptopCondition,
            laptopsGranted: laptop.laptopsGranted
          }));

          this.laptops.sort((a, b) =>
            new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
          );

          if (this.laptops.length > 0) {
            this.latestPurchaseDate = this.laptops[0].purchaseDate;
          }

          this.StatsCards[0].count = response.laptopCount ?? 0;
        } else {
          this.laptops = [];
          this.StatsCards[0].count = 0;
        }

        console.log('Mapped & Sorted Laptops:', this.laptops);
        console.log('Latest Purchase Date:', this.latestPurchaseDate);
      },
      error: (error) => {
        console.error('Error fetching laptops:', error);
      }
    });
  }

  getDesktops(): void {
    this.featuresService.getAllDesktop().subscribe({
      next: (response) => {
        console.log('Desktop API Response:', response);
        if (response && response.desktopCount !== undefined) {
          this.StatsCards[2].count = response.desktopCount;
        } else {
          this.StatsCards[2].count = 0;
        }
      },
      error: (error) => {
        console.error('Error fetching desktops:', error);
      }
    });
  }

  getServers(): void {
    this.featuresService.getAllServer(1, 1).subscribe({
      next: (response) => {
        console.log('Server API Response:', response);
        if (response && response.serverCount !== undefined) {
          this.StatsCards[3].count = response.serverCount;
        } else if (response?.servers?.length >= 0) {
          this.StatsCards[3].count = response.servers.length; // fallback count
        } else {
          this.StatsCards[3].count = 0;
        }
      },
      error: (error) => {
        console.error('Error fetching servers:', error);
        this.StatsCards[3].count = 0;
      }
    });
  }
}  