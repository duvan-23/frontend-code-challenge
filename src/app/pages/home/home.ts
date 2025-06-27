import { Component, inject } from '@angular/core';
import { DynamicField } from '@shared/models/dynamic-field.interface';
import { Validators } from '@angular/forms';
import { SubscriptionType } from '@shared/models/subscription-type.enum';
import { SubscriptionOption } from '@shared/models/subscription-option.interface';
import { DynamicForm } from '@shared/components/dynamic-form/dynamic-form';
import { SessionStorage } from '@shared/services/session-storage';
import { FileConvert } from '@shared/utils/file-convert';
import { Crypto } from '@shared/utils/crypto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [DynamicForm],
  templateUrl: './home.html'
})
export class Home {
  private sessionStorageService = inject(SessionStorage);
  private router= inject(Router);

  // List of subscription options shown in the dropdown
  private readonly subscriptionOptions: SubscriptionOption[] = [
    { value: SubscriptionType.Basic, label: 'Basic' },
    { value: SubscriptionType.Advanced, label: 'Advanced' },
    { value: SubscriptionType.Pro, label: 'Pro' },
  ];

  // Regex pattern for password: at least one letter, one special char, min length 8
  private readonly passwordPattern = '^(?=.*[A-Za-z])(?=.*[^A-Za-z0-9]).{8,}$';
  // Form fields to be rendered dynamically
  public readonly fields: DynamicField[] = [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      required: false,
      validators: [],
      defaultValue: '',
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      required: false,
      validators: [],
      defaultValue: '',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      validators: [Validators.required, Validators.email],
      defaultValue: '',
    },
    {
      name: 'subscription',
      label: 'Subscription',
      type: 'select',
      required: false,
      validators: [Validators.required],
      defaultValue: SubscriptionType.Advanced,
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
      defaultValue: '',
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

  async handleSubmit(formData: any) {
    if(formData.csv){
      formData.csv = {
        name: formData.csv.name,
        content:await FileConvert.fileToBase64(formData.csv)
      };
    }
  
    formData.password = Crypto.encrypt(formData.password);
    this.sessionStorageService.setItem('formData', formData);
    this.router.navigate(['/summary']);

  }

}
