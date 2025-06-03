import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FeaturesService } from '../../features/features.service';
import { MatIconModule } from '@angular/material/icon';
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
}

@Component({
  selector: 'app-modal-server',
  standalone: true,
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
  templateUrl: './modalserver.component.html',
  styleUrls: ['./modalserver.component.css'],
})
export class ModalserverComponent implements OnInit {
  @Output() closeModalEvent = new EventEmitter<void>();

  employees: Employee[] = [];
  isModalOpen: boolean = true;
  isAddEmployeeOpen: boolean = false;
  newEmployee: string = '';
  selectedEmployeeId: string = '';
  addServerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private featuresService: FeaturesService
  ) {
    this.addServerForm = this.fb.group({
      serverName: ['', Validators.required],
      serverSerialNumber: ['', Validators.required],
      serverOs: ['', Validators.required],
      serverProcessor: ['', Validators.required],
      serverRam: ['', Validators.required],
      serverPurchaseDate: ['', Validators.required],
      serverLocation: ['', Validators.required],
      serverAssignedTo: ['', Validators.required],
      serverCondition: ['', Validators.required],
    });
      }

  ngOnInit(): void {
    this.getEmployees();

    console.log('Form Initial Validity:', this.addServerForm.valid);
    this.addServerForm.statusChanges.subscribe(status => {
      console.log('Form Status Changed:', status);
    });
  }

  getEmployees(): void {
    this.featuresService.getAllEmployee().subscribe({
      next: (response) => {
        console.log('Raw API Response:', response);
        this.employees = response.employees;
        console.log('Employees after assignment:', this.employees);
      },
      error: (error) => console.error('Error fetching employees:', error),
    });
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.closeModalEvent.emit();
  }

  onAssignedChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    if (selectedValue === 'add') {
      this.openAddEmployeeModal();
    }
  }

  openAddEmployeeModal() {
    this.isAddEmployeeOpen = true;
  }

  closeAddEmployeeModal() {
    this.isAddEmployeeOpen = false;
    this.newEmployee = '';
  }

  onSubmit() {
    if (this.addServerForm.valid) {
      const serverData = this.addServerForm.value;
      console.log('Submitting:', serverData);

      this.featuresService.addServer(serverData).subscribe({
        next: (response) => {
          console.log('Server added successfully:', response);
          alert(response.message || 'Server added successfully.');
          this.closeModal();
        },
        error: (error) => {
          console.error('Error adding server:', error);
          alert(error.message || 'An unexpected error occurred.');
        },
      });
    }
  }
}
