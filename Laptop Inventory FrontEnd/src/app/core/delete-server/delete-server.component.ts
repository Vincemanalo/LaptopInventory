import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FeaturesService } from '../../features/features.service'; // Adjust path as needed
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-delete-server',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, MatIconModule],
  templateUrl: './delete-server.component.html',
  styleUrl: './delete-server.component.css',
})
export class DeleteServerComponent implements OnChanges {
  @Input() selectedServer: any = {};
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() refreshTableEvent = new EventEmitter<void>();

  deleteServerForm: FormGroup;
  isDeleteModalOpen: boolean = true;

  constructor(
    private fb: FormBuilder,
    private featuresService: FeaturesService
  ) {
    this.deleteServerForm = this.fb.group({
      _id: [''],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedServer'] && this.selectedServer) {
      this.deleteServerForm.patchValue({
        _id: this.selectedServer._id,
      });
    }
  }

  closeModal() {
    this.isDeleteModalOpen = false;
    this.closeModalEvent.emit();
  }

  onSubmit() {
    const serverId = this.deleteServerForm.value._id;
    console.log('Deleting Server with ID:', serverId);

    this.featuresService.disableServer(serverId).subscribe({
      next: (response) => {
        console.log('Server deleted successfully:', response);
        alert(response.message || 'Server deleted successfully.');
        this.refreshTableEvent.emit();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error deleting server:', error);
      },
    });
  }
}
