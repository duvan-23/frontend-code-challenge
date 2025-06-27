import { Component, inject } from '@angular/core';
import { Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DynamicForm } from '@shared/components/dynamic-form/dynamic-form';
import { DynamicField } from '@shared/models/dynamic-field.interface';
import { SubscriptionOption } from '@shared/models/subscription-option.interface';
import { SubscriptionType } from '@shared/models/subscription-type.enum';
import { Csv, SummaryData } from '@shared/models/summary.interface';

@Component({
  selector: 'app-edit-summary',
  imports: [DynamicForm],
  templateUrl: './edit-summary.html'
})
export class EditSummary {
  private dialogRef = inject(MatDialogRef<EditSummary>);
  readonly data: SummaryData = inject(MAT_DIALOG_DATA);
  uploadFile!: Csv;

  // List of subscription options shown in the dropdown
  private readonly subscriptionOptions: SubscriptionOption[] = [
    { value: SubscriptionType.Basic, label: 'Basic' },
    { value: SubscriptionType.Advanced, label: 'Advanced' },
    { value: SubscriptionType.Pro, label: 'Pro' },
  ];

  // Regex pattern for password: at least one letter, one special char, min length 8
  private readonly passwordPattern = '^(?=.*[A-Za-z])(?=.*[^A-Za-z0-9]).{8,}$';

  fields!: DynamicField[];

  ngOnInit() {

    if (this.data.csv && this.data.csv.content && this.data.csv.name) {
      this.uploadFile = this.data.csv;
    }

    // Form fields to be rendered dynamically
    this.fields = [
      {
        name: 'firstName',
        label: 'First Name',
        type: 'text',
        required: false,
        validators: [],
        defaultValue: this.data.firstName || '',
      },
      {
        name: 'lastName',
        label: 'Last Name',
        type: 'text',
        required: false,
        validators: [],
        defaultValue: this.data.lastName || '',
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        validators: [Validators.required, Validators.email],
        defaultValue: this.data.email || '',
      },
      {
        name: 'subscription',
        label: 'Subscription',
        type: 'select',
        required: false,
        validators: [Validators.required],
        defaultValue: this.data.subscription || SubscriptionType.Advanced,
        options: this.subscriptionOptions,
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        required: true,
        validators: [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(this.passwordPattern),
        ],
        defaultValue: this.data.password || '',
        patternHint: 'a letter and a special character.',
      },
      {
        name: 'csv',
        label: 'Upload CSV',
        type: 'file',
        required: false,
        validators: [],
        defaultValue: null,
        fileAccept: '.csv',
      },
    ];
  }

  close(): void {
    this.dialogRef.close();
  }

  handleSubmit(formData: any) {
    this.dialogRef.close(formData);
  }
}
