import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class Form {
  form!: FormGroup;
  fileName = signal<string | null>(null);
  showSummaryErrors = signal(false);
  showPassword = signal(false);
  passwordPattern = '^(?=.*[A-Za-z])(?=.*[^A-Za-z0-9]).{8,}$';
  fb = inject(FormBuilder);

  ngOnInit() {
    this.form = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      subscription: ['advanced', Validators.required],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(this.passwordPattern),
        ],
      ],
      csv: [null, Validators.required],
    });
  }

  onFileChange(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (file && file.name.endsWith('.csv')) {
      this.fileName.set(file.name);
      this.form.patchValue({ csv: file });
    } else {
      this.fileName.set(null);
      this.form.patchValue({ csv: null });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    } else {
      // this.form.markAllAsTouched();
      this.showSummaryErrors.set(true);
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
          this.form.reset({ subscription: 'advanced' });
          this.fileName.set(null);
          this.showSummaryErrors.set(false);
          this.showPassword.set(false);
        }
      });
    }
  }

  togglePassword() {
    this.showPassword.update((value) => !value);
  }
}
