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
  selector: 'app-delete-desktop',
  imports: [ReactiveFormsModule, CommonModule, MatIconModule, FormsModule],
  templateUrl: './delete-desktop.component.html',
  styleUrls: ['./delete-desktop.component.css'],
  standalone: true,
})
export class DeleteDesktopComponent implements OnChanges {
  @Input() selectedDesktop: any = {}; // Receive data from parent component
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() refreshTableEvent = new EventEmitter<void>(); // Emit event to p
  employees: Employee[] = []; // Store employees data
  selectedEmployeeId: string = ''; 

  deleteDesktopForm: FormGroup;
  isDeleteModalOpen: boolean = true;
  isAddEmployeeOpen: boolean = false; // For Add Employee modal
  newEmployee: string = '';

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
    this.deleteDesktopForm = this.fb.group({
      _id: [''], // Hidden field to store laptop ID
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedDesktop'] && this.selectedDesktop) {
      this.deleteDesktopForm.patchValue({
        _id: this.selectedDesktop._id, // Set the ID in the form
      });
    }
  }

  updateForm() {
    if (this.selectedDesktop) {
      this.deleteDesktopForm.patchValue({
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
    this.isDeleteModalOpen = false;
    this.closeModalEvent.emit();
  }
  
  onSubmit() {
    const desktopId = this.deleteDesktopForm.value._id;
    console.log('Deleting Desktop with ID:', desktopId);

    this.featuresService.disableDesktop(desktopId).subscribe({
      next: (response) => {
        console.log('Desktop deleted successfully:', response);
        alert(response.message || 'Desktop deleted successfully.');

        this.refreshTableEvent.emit(); // Emit event to refresh table

        this.closeModal(); // Close modal after deletion
      },
      error: (error) => {
        console.error('Error deleting desktop:', error);
      },
    });
  }
}
