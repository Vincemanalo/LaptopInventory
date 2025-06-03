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
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

interface Employee {
  _id: string;
  employeeName: string;
  employmentDate: Date;
  employmentPeriod: string;
  status: string;
}

@Component({
  selector: 'app-updates-desktop',
  imports: [ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,

  ],
  templateUrl: './updates-desktop.component.html',
  styleUrls: ['./updates-desktop.component.css'],
  standalone: true,
})
export class UpdatesDesktopComponent implements OnChanges {
  @Input() selectedDesktop: any = {}; // Receive data from parent component
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() refreshTableEvent = new EventEmitter<void>(); //
  //  Emit event to p
  employees: Employee[] = []; // Store employees data
  selectedEmployeeId: string = ''; // Store selected employee ID
  editDesktopForm: FormGroup;
  isEditModalOpen: boolean = true;
  isAddEmployeeOpen: boolean = false; // For Add Employee modal
  newEmployee: string = '';

  locations: string[] = ['New Office', '1NK Center']; // Example locations
  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees(): void {
    this.featuresService.getAllEmployee().subscribe({
      next: (response) => {
        this.employees = response.employees; // Extract only the array
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
    this.editDesktopForm = this.fb.group({
      desktopName: ['', Validators.required],
      desktopSerialNumber: ['', Validators.required],
      desktopModel: ['', [Validators.maxLength(50)]],
      desktopProcessor: ['', Validators.required],
      desktopRam: ['', Validators.required],
      desktopStorage: ['', Validators.required],
      desktopPurchaseDate: ['', Validators.required],
      desktopLocation: ['', Validators.required],
      desktopAssignedTo: [''],
      desktopCondition: ['', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedDesktop'] && this.selectedDesktop) {
      this.updateForm();
    }
  }

  updateForm() {
    if (this.selectedDesktop) {
      this.editDesktopForm.patchValue({
        desktopName: this.selectedDesktop.desktopName || '',
        desktopSerialNumber: this.selectedDesktop.desktopSerialNumber || '',
        desktopModel: this.selectedDesktop.desktopModel || '',
        desktopProcessor: this.selectedDesktop.desktopProcessor || '',
        desktopRam: this.selectedDesktop.desktopRam || '',
        desktopStorage: this.selectedDesktop.desktopStorage || '',
        desktopPurchaseDate: this.selectedDesktop.desktopPurchaseDate || '',
        desktopLocation: this.selectedDesktop.desktopLocation || '',
        desktopAssignedTo: this.selectedDesktop.desktopAssignedTo || '',
        desktopCondition: this.selectedDesktop.desktopCondition || '',

      });
    }
  }

  closeModal() {
    this.isEditModalOpen = false;
    this.closeModalEvent.emit();
  }

  onAssignedChange(event: MatSelectChange) {
    const selectedValue = event.value; // Use event.value directly
  
    if (selectedValue === 'add') {
      this.openAddEmployeeModal();
    } else {
      this.selectedEmployeeId = selectedValue;
    }
  }  

  openAddEmployeeModal() {
    this.isAddEmployeeOpen = true;
  }

  closeAddEmployeeModal() {
    this.isAddEmployeeOpen = false;
    this.newEmployee = '';
  }

  addEmployee() {
    if (this.newEmployee) {
      // Add new employee logic here
      console.log('New Employee:', this.newEmployee);
      this.closeAddEmployeeModal();
    }        
  }

  onConditionChange(event: MatSelectChange) {
    if (event && event.value) {
      console.log('Desktop Condition changed to:', event.value);
      this.editDesktopForm.patchValue({ desktopCondition: event.value });
    }
  }

  onSubmit() {
    if (this.editDesktopForm.valid) {
      const desktopData = this.editDesktopForm.value;
      console.log('Submitting:', desktopData);
  
      this.featuresService
        .updateDesktop(this.selectedDesktop._id, desktopData)
        .subscribe({
          next: (response) => {
            console.log(this.selectedDesktop._id);
            console.log('Desktop edited successfully:', response);
            alert(response.message || 'Desktop edited successfully.');
            this.refreshTableEvent.emit(); // Emit event to refresh table
            this.closeModal();
          },
          error: (error) => {
            console.error('Error editing desktop:', error);
            // Show an alert with the message from the backend
            alert(error.message || 'An error occurred while editing the desktop.');
          },
        });
    }
  }
}
