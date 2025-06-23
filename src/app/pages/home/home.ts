import { Component } from '@angular/core';
import { DynamicField } from '@shared/models/dynamic-field.interface';
import { Validators } from '@angular/forms';
import { SubscriptionType } from '@shared/models/subscription-type.enum';
import { SubscriptionOption } from '@shared/models/subscription-option.interface';
import { DynamicForm } from '@shared/components/dynamic-form/dynamic-form';

@Component({
  selector: 'app-home',
  imports: [DynamicForm],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  subscriptionOptions: SubscriptionOption[] = [
    { value: SubscriptionType.Basic, label: 'Basic' },
    { value: SubscriptionType.Advanced, label: 'Advanced' },
    { value: SubscriptionType.Pro, label: 'Pro' },
  ];
  passwordPattern = '^(?=.*[A-Za-z])(?=.*[^A-Za-z0-9]).{8,}$';

  fields: DynamicField[] = [
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

  handleSubmit(formData: any) {
    console.log('Form submitted:', formData);
  }
}
