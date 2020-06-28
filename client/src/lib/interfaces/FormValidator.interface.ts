export interface IFormValidator {
  /**
   * Reference to the form we want to validate. Create
   * a reference by setting the `ref` attribute on an
   * element or component
   */
  formRef?: any;

  /**
   * Form is valid
   */
  valid: boolean;

  /**
   * Validate the form, returning true if successful, and false if not
   */
  validate(): boolean;

  /**
   * Reset the form's validation
   */
  resetValidation(): void;
}
