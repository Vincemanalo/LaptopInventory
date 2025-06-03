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
  selector: 'app-delete',
  imports: [ReactiveFormsModule, CommonModule, MatIconModule, FormsModule],
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css'],
  standalone: true,
})
export class DeleteComponent implements OnChanges {
  @Input() selectedLaptop: any = {}; // Receive data from parent component
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() refreshTableEvent = new EventEmitter<void>(); // Emit event to p
  employees: Employee[] = []; // Store employees data
  selectedEmployeeId: string = ''; 

  deleteLaptopForm: FormGroup;
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
    this.deleteLaptopForm = this.fb.group({
      _id: [''], // Hidden field to store laptop ID
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedLaptop'] && this.selectedLaptop) {
      this.deleteLaptopForm.patchValue({
        _id: this.selectedLaptop._id, // Set the ID in the form
      });
    }
  }

  updateForm() {
    if (this.selectedLaptop) {
      this.deleteLaptopForm.patchValue({
        laptopName: this.selectedLaptop.laptopName || '',
        laptopSerialNumber: this.selectedLaptop.laptopSerialNumber || '',
        laptopDescription: this.selectedLaptop.laptopDescription || '',
        laptopPurchaseDate: this.selectedLaptop.laptopPurchaseDate || '',
        laptopLocation: this.selectedLaptop.laptopLocation || '',
        laptopAssignedTo: this.selectedLaptop.laptopAssignedTo || '',
        laptopCondition: this.selectedLaptop.laptopCondition || '',
      });
    }
  }

  closeModal() {
    this.isDeleteModalOpen = false;
    this.closeModalEvent.emit();
  }
  
  onSubmit() {
    const laptopId = this.deleteLaptopForm.value._id;
    console.log('Deleting Laptop with ID:', laptopId);

    this.featuresService.disableLaptop(laptopId).subscribe({
      next: (response) => {
        console.log('Laptop deleted successfully:', response);
        alert(response.message || 'Laptop deleted successfully.');

        this.refreshTableEvent.emit(); // Emit event to refresh table

        this.closeModal(); // Close modal after deletion
      },
      error: (error) => {
        console.error('Error deleting laptop:', error);
      },
    });
  }
}
