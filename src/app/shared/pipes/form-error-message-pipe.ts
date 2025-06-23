import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Pipe({
  name: 'formErrorMessage',
  pure: false
})
export class FormErrorMessagePipe implements PipeTransform {

  transform(control: AbstractControl | null, fieldName?: string, extraMessage?: string): unknown {
    if (!control || !control.errors ) return '';

    const errors = control.errors;

    const name = fieldName || 'This field';

    if (errors['required']) return `${name} is required.`;
    if (errors['email']) return `${name} must be a valid email address.`;
    if (errors['minlength']) {
      const { requiredLength } = errors['minlength'];
      return `${name} must be at least ${requiredLength} characters.`;
    }
    if (errors['maxlength']) {
      const { requiredLength } = errors['maxlength'];
      return `${name} must be at most ${requiredLength} characters.`;
    }
    if (errors['pattern']) return `${name} must include ${extraMessage ? ' ' + extraMessage : ''}`;

    return `${name} is invalid.`;
  }

}
