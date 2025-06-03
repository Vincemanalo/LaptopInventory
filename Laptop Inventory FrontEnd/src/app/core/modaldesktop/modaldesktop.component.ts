import { ChangeDetectionStrategy, Component, EventEmitter, Output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FeaturesService } from "../../features/features.service";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
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
  standalone: true,
  templateUrl: "./modaldesktop.component.html",
  styleUrls: ["./modaldesktop.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ]
})
export class ModalDesktopComponent {
  @Output() closeModalEvent = new EventEmitter<void>();

  public editDesktopForm: FormGroup; // marked as public
  employees: Employee[] = [];
  selectedEmployeeId: string = "";
  isModalOpen: boolean = true;
  isAddEmployeeOpen: boolean = false;
  newEmployee: string = "";
  isOpen = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private featuresService: FeaturesService
  ) {
    this.editDesktopForm = this.fb.group({
      desktopName: ["", Validators.required],
      desktopSerialNumber: ["", Validators.required],
      desktopModel: ["", [Validators.required, Validators.maxLength(50)]],
      desktopProcessor: ["", Validators.required],
      desktopRam: ["", Validators.required],
      desktopStorage: ["", Validators.required],
      desktopPurchaseDate: ["", Validators.required],
      desktopLocation: ["", Validators.required],
      desktopAssignedTo: ["", Validators.required],
      desktopCondition: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    this.getEmployees();

    console.log("Form Initial Validity:", this.editDesktopForm.valid);
    this.editDesktopForm.statusChanges.subscribe(status => {
      console.log("Form Status Changed:", status);
    });
  }

  getEmployees(): void {
    this.featuresService.getAllEmployee().subscribe({
      next: (response) => {
        this.employees = response.employees;
      },
      error: (error) => console.error("Error fetching employees:", error),
    });
  }

  openModal() {
    this.isOpen = true;
  }

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

  onSubmit() {
    if (this.editDesktopForm.invalid) {
      console.warn("Attempted submission with invalid form");
      return;
    }
  
    const desktopData = this.editDesktopForm.value;
    this.featuresService.addDesktop(desktopData).subscribe({
      next: (response) => {
        alert(response.message || 'Desktop added successfully.');
        this.closeModal();
      },
      error: (error) => {
        console.error("Error adding desktop:", error);
        alert(error.message || 'An unexpected error occurred.');
      },
    });
  }
}  