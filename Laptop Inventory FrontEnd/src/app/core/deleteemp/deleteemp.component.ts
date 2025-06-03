import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FeaturesService } from '../../features/features.service';

interface Employee {
  _id: string;
  employeeName: string;
  employmentDate: Date;
  employmentPeriod: string;
  status: string;
}

@Component({
  selector: 'app-deleteemp',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule, FormsModule],
  templateUrl: './deleteemp.component.html',
  styleUrl: './deleteemp.component.css',
})
export class DeleteEmpComponent implements OnChanges {
  @Input() selectedEmployee: any = {}; // Changed from selectedLaptop
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() refreshTableEvent = new EventEmitter<void>(); // Emit event to refresh table

  deleteEmployeeForm: FormGroup; // Changed from deleteLaptopForm
  isDeleteModalOpen: boolean = true;
  employees: Employee[] = []; // Store employees data
  selectedEmployeeId: string = ''; // Store selected employee ID
  
  locations: string[] = ['New Office', '1NK Center']; // Example locations
  ngOnInit(): void {
    this.getEmployees();
  }

  // Fetch employees from backend
  getEmployees(): void {
    this.featuresService.getAllEmployee().subscribe({
      next: (response) => {
        this.employees = response;
        console.log('Employees fetched:', this.employees);
      },
      error: (error) => console.error('Error fetching employees:', error),
    });
  }
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private featuresService: FeaturesService
  ) {
    this.deleteEmployeeForm = this.fb.group({
      _id: [''], // Hidden field to store employee ID
    });
  }
  

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedEmployee'] && this.selectedEmployee) {
      this.deleteEmployeeForm.patchValue({
        _id: this.selectedEmployee._id, // Set the ID in the form
      });
    }
  }
  updateForm() {
    if (this.selectedEmployee) {
      this.deleteEmployeeForm.patchValue({
        employeeName: this.selectedEmployee.employeeName || '',
        employmentDate: this.selectedEmployee.employmentDate || '',
        employmentPeriod: this.selectedEmployee.employmentPeriod || '',
      });
    }
  }

  closeModal() {
    this.isDeleteModalOpen = false;
    this.closeModalEvent.emit();
  }

  onSubmit() {
    const employeeId = this.deleteEmployeeForm.value._id;
    console.log('Deleting Employee with ID:', employeeId);

    this.featuresService.disableEmployee(employeeId).subscribe({
      next: (response) => {
        console.log('Employee deleted successfully:', response);
        alert(response.message || 'Employee deleted successfully.');
        this.refreshTableEvent.emit(); // Notify parent to refresh table data

        this.closeModal(); // Close modal after deletion
      },
      error: (error) => {
        console.error('Error deleting employee:', error);
      },
    });
  }
}
