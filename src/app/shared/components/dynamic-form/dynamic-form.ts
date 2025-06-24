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
  @Input() fields: DynamicField[] = [];
  @Input() uploadFile?: Csv;
  @Output() formSubmitted = new EventEmitter<any>();

  form!: FormGroup;
  fileName = signal<string | null>(null);
  showSummaryErrors = signal(false);
  showPassword = signal(false);
  fb = inject(FormBuilder);
  formChanges!: Subscription;
  defaultFormValues!: FormGroup;

  ngOnInit() {
    if (this.uploadFile && this.uploadFile.name) {
      this.fileName.set(this.uploadFile.name);
    }
    const group: Record<string, any> = {};
    this.fields.forEach((field) => {
      group[field.name] = [field.defaultValue, field.validators || []];
    });
    this.form = this.fb.group(group);
    this.defaultFormValues = this.form.getRawValue();
    this.subscribeToFormChanges();
    console.log(this.defaultFormValues);
  }

  subscribeToFormChanges() {
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
            control.markAsTouched();
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
    }
  }

  onFileChange(event: Event, fieldName: string) {
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
  }

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
          this.formChanges.unsubscribe();
          this.form.reset(this.defaultFormValues);
          this.fileName.set(null);
          this.showSummaryErrors.set(false);
          this.showPassword.set(false);
          this.subscribeToFormChanges();
        }
      });
    }
  }

  togglePassword() {
    this.showPassword.update((value) => !value);
  }

  ngOnDestroy() {
    this.formChanges?.unsubscribe();
  }
}
