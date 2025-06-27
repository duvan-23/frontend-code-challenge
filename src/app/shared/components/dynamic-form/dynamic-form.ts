import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HighlightInvalid } from '@shared/directives/highlight-invalid';
import { DynamicField } from '@shared/models/dynamic-field.interface';
import { Csv } from '@shared/models/summary.interface';
import { ValidatorErrors } from '@shared/models/validator-errors.type';
import { FormErrorMessagePipe } from '@shared/pipes/form-error-message-pipe';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dynamic-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HighlightInvalid,
    FormErrorMessagePipe,
  ],
  templateUrl: './dynamic-form.html',
  styleUrl: './dynamic-form.css',
})
export class DynamicForm {
  @Input({ required: true }) fields: DynamicField[] = [];
  @Input() uploadFile?: Csv;
  @Input() edit? = false;
  @Output() formSubmitted = new EventEmitter<any>();

  private readonly fb = inject(FormBuilder);
  private formChanges!: Subscription;
  private defaultFormValues!: FormGroup;
  form!: FormGroup;
  fileName = signal<string | null>(null);
  showSummaryErrors = signal(false);
  showPassword = signal(false);
  errorReady = signal<Record<string, ValidatorErrors | null>>({});

  ngOnInit() {
    this.setFileName();
    // Build the form structure dynamically based on input fields
    const group: Record<string, any> = {};
    this.fields.forEach((field) => {
      group[field.name] = [field.defaultValue, field.validators || []];
    });
    this.form = this.fb.group(group);
    this.defaultFormValues = this.form.getRawValue();
    this.subscribeToFormChanges();
  }

  private setFileName() {
    if (this.uploadFile && this.uploadFile.name) {
      this.fileName.set(this.uploadFile.name);
    }
  }

  // Subscribe to form changes to track validation errors with debounce
  private subscribeToFormChanges() {
    let previousValues = this.form.value;

    this.formChanges = this.form.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((currentValues) => {
        const changedField = Object.keys(currentValues).find(
          (key) => currentValues[key] !== previousValues[key]
        );

        if (changedField) {
          const control = this.form.get(changedField);
          if (control && control.invalid) {
            const current = this.errorReady();
            current[changedField] = { ...control.errors };
            this.errorReady.set({ ...current });
            control.markAsTouched();
          } else {
            const current = this.errorReady();
            delete current[changedField];
            this.errorReady.set({ ...current });
          }
        }

        if (this.form.valid) {
          this.showSummaryErrors.set(false);
        }

        previousValues = currentValues;
      });
  }

  onSubmit() {
    if (this.form.valid) {
      this.formSubmitted.emit(this.form.value);
    } else {
      this.showSummaryErrors.set(true);
      this.fields.forEach((field) => {
        const control = this.form.get(field.name);
        if (control?.invalid) {
          control.markAsTouched();
          const current = this.errorReady();
          current[field.name] = { ...control.errors };
          this.errorReady.set({ ...current });
        }
      });
    }
  }

  // Handle file selection and validation
  onFileChange(
    event: Event,
    fieldName: string,
    inputElement: HTMLInputElement
  ) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (file) {
      this.fileName.set(file.name);
      this.form.patchValue({ [fieldName]: file });
      this.form.get(fieldName)?.markAsDirty();
      this.form.get(fieldName)?.markAsTouched();
    } else {
      this.fileName.set(null);
      this.form.patchValue({ [fieldName]: null });
    }
    inputElement.value = '';
  }

  // Resets the form and related signals with confirmation
  onClear() {
    if (this.form.dirty) {
      Swal.fire({
        title: 'Are you sure you want to discard changes?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#ec4899',
        confirmButtonText: 'Yes, reset it!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.errorReady.set({});
          this.formChanges.unsubscribe();
          this.form.reset(this.defaultFormValues);
          this.fileName.set(null);
          this.showSummaryErrors.set(false);
          this.showPassword.set(false);
          this.subscribeToFormChanges();
          this.setFileName();
        }
      });
    }
  }

  // Utility to check if there are any errors in the form
  isErrorReadyEmpty() {
    return Object.keys(this.errorReady()).length === 0;
  }

  togglePassword() {
    this.showPassword.update((value) => !value);
  }

  ngOnDestroy() {
    this.formChanges?.unsubscribe();
  }
}
