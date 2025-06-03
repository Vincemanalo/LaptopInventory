import { ChangeDetectionStrategy, Component, EventEmitter, Output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FeaturesService } from "../../features/features.service";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from "@angular/material/core";

interface Employee {
  _id: string;
  employeeName: string;
  employmentDate: Date;
  employmentPeriod: string;
  status: string;
}

@Component({
  selector: "app-modal",
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
  ], changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.css"],
  standalone: true,
})
export class ModalComponent {
  @Output() closeModalEvent = new EventEmitter<void>();

  employees: Employee[] = []; // Store employees data
  selectedEmployeeId: string = ""; // Store selected employee ID
  editLaptopForm: FormGroup;
  isModalOpen: boolean = true;
  isAddEmployeeOpen: boolean = false; // For Add Employee modal
  newEmployee: string = "";



  ngOnInit(): void {
    this.getEmployees();

    console.log("Form Initial Validity:", this.editLaptopForm.valid);
    this.editLaptopForm.statusChanges.subscribe(status => {
      console.log("Form Status Changed:", status);
    });  
  }

  // Fetch employees from backend
  getEmployees(): void {
    this.featuresService.getAllEmployee().subscribe({
      next: (response) => {
        console.log("Raw API Response:", response); // Debugging
        this.employees = response.employees ; 
        console.log("Employees after assignment:", this.employees);
      },
      error: (error) => console.error("Error fetching employees:", error),
    });
  }  

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private featuresService: FeaturesService
  ) {
    this.editLaptopForm = this.fb.group({
      laptopName: ["", Validators.required],
      laptopSerialNumber: ["", Validators.required],
      laptopDescription: ["", [Validators.maxLength(50)]],
      laptopPurchaseDate: ["", Validators.required],
      laptopLocation: ["", Validators.required],
      laptopAssignedTo: [null, Validators.required],
      laptopCondition: ["", Validators.required],
    });
  }

  isOpen = false;

  openModal() {
    this.isOpen = true;
  }

  // Close main modal
  closeModal() {
    this.isModalOpen = false;
    this.closeModalEvent.emit();
  }

  onAssignedChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    if (selectedValue === "add") {
      this.openAddEmployeeModal();
    }
  }

  openAddEmployeeModal() {
    this.isAddEmployeeOpen = true;
  }

  closeAddEmployeeModal() {
    this.isAddEmployeeOpen = false;
    this.newEmployee = "";
  }

  // addEmployee() {
  //   if (this.newEmployee.trim()) {
  //     this.employees.push(this.newEmployee.trim());
  //     this.closeAddEmployeeModal();
  //   }
  // }

  onSubmit() {
    if (this.editLaptopForm.valid) {
      const laptopData = this.editLaptopForm.value;
      console.log("Submitting:", laptopData);
  
      this.featuresService.addLaptop(laptopData).subscribe({
        next: (response) => {
          console.log("Laptop added successfully:", response);
          alert(response.message || 'Laptop added successfully.');
          this.closeModal();
        },
        error: (error) => {
          console.error("Error adding laptop:", error);
          // Show alert with message from backend
          alert(error.message || 'An unexpected error occurred.');
        },
      });
    }
  }  
}
