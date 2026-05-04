/**
 * Form Validation Utilities
 * Real-time validation for booking form fields
 */

export interface ValidationError {
  [key: string]: string;
}

export const validateField = (name: string, value: string): string => {
  // Allow empty values for optional fields
  const optionalFields = ['notes'];

  if (!optionalFields.includes(name) && (!value || !value.trim())) {
    return 'Campo obbligatorio';
  }

  switch (name) {
    case 'first_name':
    case 'last_name':
      return value.trim().length < 2 ? 'Minimo 2 caratteri' : '';

    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) ? '' : 'Email non valida';

    case 'phone':
      const phoneRegex = /^[0-9\s\+\-\(\)]{8,}$/;
      return phoneRegex.test(value.replace(/\s/g, '')) ? '' : 'Numero di telefono non valido';

    case 'guest_count':
      const count = parseInt(value, 10);
      if (isNaN(count) || count < 1) return 'Numero di ospiti obbligatorio';
      if (count > 400) return 'Massimo 400 ospiti';
      return '';

    case 'event_date':
      const eventDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return eventDate < today ? 'La data deve essere futura' : '';

    case 'event_type':
      const validTypes = ['matrimonio', 'corporate', 'degustazione', 'wellness', 'photoshoot', 'team'];
      return validTypes.includes(value) ? '' : 'Tipo di evento non valido';

    case 'notes':
      // Optional field, no validation needed
      return '';

    default:
      return '';
  }
};

export const validateForm = (formData: {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  event_date: string;
  guest_count: string;
  event_type: string;
  notes: string;
}): ValidationError => {
  const errors: ValidationError = {};

  Object.entries(formData).forEach(([key, value]) => {
    const error = validateField(key, value);
    if (error) {
      errors[key] = error;
    }
  });

  return errors;
};

export const isFormValid = (errors: ValidationError): boolean => {
  return Object.keys(errors).length === 0;
};

/**
 * Phone number input masking
 * Formats input to: +39 373 XXX XXXX
 */
export const formatPhoneNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');

  // Handle both Italian (+39) and local (3xx) formats
  let formatted = '';

  if (cleaned.length === 0) return '';

  if (cleaned.startsWith('39')) {
    if (cleaned.length <= 2) return '+' + cleaned;
    if (cleaned.length <= 5) return '+' + cleaned.slice(0, 2) + ' ' + cleaned.slice(2);
    if (cleaned.length <= 9) return '+' + cleaned.slice(0, 2) + ' ' + cleaned.slice(2, 5) + ' ' + cleaned.slice(5);
    return '+' + cleaned.slice(0, 2) + ' ' + cleaned.slice(2, 5) + ' ' + cleaned.slice(5, 9) + ' ' + cleaned.slice(9);
  } else {
    // Local format (3xx prefix)
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return cleaned.slice(0, 3) + ' ' + cleaned.slice(3);
    if (cleaned.length <= 9) return cleaned.slice(0, 3) + ' ' + cleaned.slice(3, 6) + ' ' + cleaned.slice(6);
    return cleaned.slice(0, 3) + ' ' + cleaned.slice(3, 6) + ' ' + cleaned.slice(6, 10);
  }
};
