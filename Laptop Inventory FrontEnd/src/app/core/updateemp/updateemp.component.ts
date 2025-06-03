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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

interface Employee {
  _id: string;
  employeeName: string;
  employmentDate: Date;
  employmentPeriod: string;
  status: string;
  selectedEmployee: any;
}

@Component({
  selector: 'app-updatesemp',
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
  templateUrl: './updateemp.component.html',
  styleUrls: ['./updateemp.component.css'],
  standalone: true,
})
export class UpdatesEmpComponent implements OnChanges {
  @Input() selectedEmployee: any = {}; // Data passed from the parent component
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() refreshTableEvent = new EventEmitter<void>(); // Emit event to refresh table

  employees: Employee[] = []; // Store employees if needed elsewhere
  selectedEmployeeId: string = ''; // (Optional) Store selected employee ID
  editEmployeeForm!: FormGroup;
  isEditModalOpen: boolean = true;
  isAddEmployeeOpen: boolean = false; // For Add Employee modal
  newEmployee: string = '';

  displayedColumns: string[] = [
    'employeeName',
    'employmentDate',
    'employmentPeriod',
    'actions',
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private featuresService: FeaturesService
  ) {
    // Define the form with form controls that correspond to the backend data
    this.editEmployeeForm = this.fb.group({
      employeeName: ['', Validators.required],
      employmentDate: ['', Validators.required],
      employmentPeriod: ['', Validators.required],
    });
  }

  // If the selectedEmployee input changes, update the form
  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedEmployee']) {
      console.log('selectedEmployee changed:', this.selectedEmployee);
      if (this.selectedEmployee) {
        this.updateForm();
      }
    }
  }
    // Update the form fields with the backend data
  updateForm() {
    if (this.selectedEmployee) {
      this.editEmployeeForm.patchValue({
        employeeName: this.selectedEmployee.employeeName || '',
        employmentDate: this.selectedEmployee.employmentDate || '',
        employmentPeriod: this.selectedEmployee.employmentPeriod || '',
      });
    }
  }

  // Close the modal
  closeModal() {
    this.isEditModalOpen = false;
    this.closeModalEvent.emit();
  }

  // Optionally open or close additional modals if you have add employee logic
  openEditEmployeeModal() {
    this.isEditModalOpen = true;
  }

  closeEditEmployeeModal() {
    this.isEditModalOpen = false;
    this.closeModalEvent.emit();
    this.newEmployee = '';
  }

  addEmployee() {
    if (this.newEmployee) {
      console.log('New Employee:', this.newEmployee);
      this.closeEditEmployeeModal();
    }
  }

  // When the form is submitted, call the updateEmployee method from your service
  onSubmit() {
    if (this.editEmployeeForm.valid) {
      const employeeData = this.editEmployeeForm.value;
      console.log('Submitting:', employeeData);
  
      this.featuresService
        .updateEmployee(this.selectedEmployee._id, employeeData)
        .subscribe({
          next: (response) => {
            console.log(this.selectedEmployee._id);
            console.log('Employee edited successfully:', response);
            alert(response.message || 'Employee updated successfully.');
            this.refreshTableEvent.emit(); // Notify parent to refresh table data
            this.closeModal();
          },
          error: (error) => {
            console.error('Error editing employee:', error);
            // Show alert with backend message if available
            alert(error.message || 'An error occurred while editing the employee.');
          },
        });
    }
  }
}
