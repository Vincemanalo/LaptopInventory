import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

interface Employee {
  _id: string;
  employeeName: string;
  employeeEmail: string;
  employmentDate: Date;
  employmentPeriod: string;
  status: string;
}

@Component({
  selector: 'app-addemp',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './addemp.component.html',
  styleUrls: ['./addemp.component.css'],
  standalone: true,
})
export class AddempComponent {
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() employeeAdded = new EventEmitter<void>();

  employees: Employee[] = [];
  selectedEmployeeId: string = '';
  editEmployeeForm!: FormGroup;  // Use definite assignment operator
  isModalOpen: boolean = true;
  isAddEmployeeOpen: boolean = false;
  newEmployee: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private featuresService: FeaturesService
  ) {
    this.editEmployeeForm = this.fb.group({
      employeeName: ['', Validators.required],
      employmentDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getEmployees();
  }

  // Removed the misplaced code from the class body

  getEmployees(): void {
    this.featuresService.getAllEmployee().subscribe({
      next: (response: any) => {
        this.employees = response;
        console.log('Employees fetched:', this.employees);
      },
      error: (error: any) => console.error('Error fetching employees:', error),
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.closeModalEvent.emit();
  }

  onAssignedChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    if (selectedValue === 'add') {
      this.openAddEmployeeModal();
    }
  }

  openAddEmployeeModal(): void {
    this.isAddEmployeeOpen = true;
    setTimeout(() => {
      this.getEmployees();
    }, 100);
  }

  closeAddEmployeeModal(): void {
    this.isAddEmployeeOpen = false;
    this.newEmployee = '';
  }

  onSubmit(): void {
    if (this.editEmployeeForm.valid) {
      const employeesdata = this.editEmployeeForm.value;
      console.log('Submitting:', employeesdata);
      this.featuresService.addEmployee(employeesdata).subscribe({
        next: (response: any) => {
          console.log('Employee added successfully:', response);
          alert(response.message || 'Employee added successfully.');
          this.employeeAdded.emit();  // Notify parent component if needed
          this.closeModal();
        },
        error: (error: any) => {
          console.error('Error adding Employee:', error);
          // If the call fails, display an alert with the error message.
          alert(error?.message || 'Failed to add Employee');
        },
      });
    }
  }
  
}
