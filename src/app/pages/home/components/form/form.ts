import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
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
  subscriptionOptions = [
    { value: 'basic', label: 'Basic' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'pro', label: 'Pro' }
  ];
  formChanges!: Subscription;

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
      csv: [null],
    });
    this.subscribeToFormChanges();
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

  onFileChange(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (file && file.name.endsWith('.csv')) {
      this.fileName.set(file.name);
      this.form.patchValue({ csv: file });
      this.form.get('csv')?.markAsDirty();
      this.form.get('csv')?.markAsTouched();
    } else {
      this.fileName.set(null);
      this.form.patchValue({ csv: null });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    } else {
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
          this.formChanges.unsubscribe();
          this.form.reset({ subscription: 'advanced' });
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

  getEmailErrorMessage(): string {
    const email = this.form.get('email');
    if (email?.hasError('required')) return 'Email is required.';
    if (email?.hasError('email')) return 'Email is invalid.';
    return '';
  }

  getPasswordErrorMessage(): string {
    const password = this.form.get('password');
    if (password?.hasError('required')) return 'Password is required.';
    if (password?.hasError('minlength'))
      return 'Password must be at least 8 characters.';
    if (password?.hasError('pattern'))
      return 'Password must include a letter and a special character.';
    return '';
  }

  ngOnDestroy() {
    this.formChanges?.unsubscribe();
  }
}
