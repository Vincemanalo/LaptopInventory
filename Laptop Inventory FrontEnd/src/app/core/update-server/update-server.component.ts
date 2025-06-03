import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FeaturesService } from '../../features/features.service';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule, MatSelectChange } from '@angular/material/select';

interface Employee {
  _id: string;
  employeeName: string;
  employmentDate: Date;
  employmentPeriod: string;
  status: string;
}

@Component({
  selector: 'app-update-server',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
  ],
  templateUrl: './update-server.component.html',
  styleUrls: ['./update-server.component.css'],
})
export class UpdateServerComponent implements OnInit, OnChanges {
  @Input() selectedServer: any = {}; // from table row
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() refreshTableEvent = new EventEmitter<void>();

  editServerForm: FormGroup;
  isEditModalOpen: boolean = true;
  isAddEmployeeOpen: boolean = false;
  newEmployee: string = '';
  selectedEmployeeId: string = '';

  employees: Employee[] = [];
  locations: string[] = ['1NK Center', 'New Office', 'Warehouse'];

  constructor(
    private fb: FormBuilder,
    private featuresService: FeaturesService,
    private router: Router
  ) {
    this.editServerForm = this.fb.group({
      serverName: ['', Validators.required],
      serverSerialNumber: ['', Validators.required],
      serverOs: ['', Validators.required],
      serverProcessor: ['', Validators.required],
      serverRam: ['', Validators.required],
      serverPurchaseDate: ['', Validators.required],
      serverLocation: ['', Validators.required],
      serverAssignedTo: [''],
      serverCondition: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getEmployees();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedServer'] && this.selectedServer) {
      this.updateForm();
    }
  }

  updateForm(): void {
    this.editServerForm.patchValue({
      serverName: this.selectedServer.serverName || '',
      serverSerialNumber: this.selectedServer.serverSerialNumber || '',
      serverOs: this.selectedServer.serverOs || '',
      serverProcessor: this.selectedServer.serverProcessor || '',
      serverRam: this.selectedServer.serverRam || '',
      serverPurchaseDate: this.selectedServer.serverPurchaseDate || '',
      serverLocation: this.selectedServer.serverLocation || '',
      serverAssignedTo: this.selectedServer.serverAssignedTo || '',
      serverCondition: this.selectedServer.serverCondition || '',
    });
  }

  getEmployees(): void {
    this.featuresService.getAllEmployee().subscribe({
      next: (response) => {
        this.employees = response.employees || [];
        console.log('Employees fetched:', this.employees);
      },
      error: (error) => console.error('Error fetching employees:', error),
    });
  }

  closeModal(): void {
    this.isEditModalOpen = false;
    this.closeModalEvent.emit();
  }

  onAssignedChange(event: MatSelectChange): void {
    const selectedValue = event.value;
    if (selectedValue === 'add') {
      this.openAddEmployeeModal();
    } else {
      this.selectedEmployeeId = selectedValue;
    }
  }

  onConditionChange(event: MatSelectChange): void {
    if (event && event.value) {
      this.editServerForm.patchValue({ serverCondition: event.value });
    }
  }

  openAddEmployeeModal(): void {
    this.isAddEmployeeOpen = true;
  }

  closeAddEmployeeModal(): void {
    this.isAddEmployeeOpen = false;
    this.newEmployee = '';
  }

  addEmployee(): void {
    if (this.newEmployee) {
      console.log('New Employee:', this.newEmployee);
      this.closeAddEmployeeModal();
    }
  }

  onSubmit(): void {
    if (this.editServerForm.valid) {
      const serverData = this.editServerForm.value;
      console.log('Updating Server:', serverData);

      this.featuresService.updateServer(this.selectedServer._id, serverData).subscribe({
        next: (response) => {
          alert(response.message || 'Server updated successfully.');
          this.refreshTableEvent.emit();
          this.closeModal();
        },
        error: (error) => {
          alert(error.message || 'An error occurred while updating the server.');
          console.error(error);
        },
      });
    }
  }
}
