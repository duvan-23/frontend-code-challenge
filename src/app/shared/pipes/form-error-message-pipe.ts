import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Pipe({
  name: 'formErrorMessage',
  pure: false,
})
export class FormErrorMessagePipe implements PipeTransform {
  transform(
    control: AbstractControl | null,
    fieldName: string ='This field',
    extraMessage?: string,
    overrideErrors?: any
  ): unknown {
    const errors = overrideErrors || control?.errors;
    if (!errors) return '';

    if (errors['required']) return `${fieldName} is required.`;
    if (errors['email']) return `${fieldName} must be a valid email address.`;
    if (errors['minlength']) {
      const { requiredLength } = errors['minlength'];
      return `${fieldName} must be at least ${requiredLength} characters.`;
    }
    if (errors['maxlength']) {
      const { requiredLength } = errors['maxlength'];
      return `${fieldName} must be at most ${requiredLength} characters.`;
    }
    if (errors['pattern'])
      return `${fieldName} must include ${extraMessage ? ' ' + extraMessage : ''}`;

    return `${fieldName} is invalid.`;
  }
}
