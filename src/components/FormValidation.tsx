/**
 * Form Field Error Message Component
 * Displays validation errors below form fields
 */

interface FormErrorProps {
  error?: string;
  touched?: boolean;
}

export function FormError({ error, touched }: FormErrorProps) {
  if (!touched || !error) {
    return null;
  }

  return (
    <p className="text-red-500 text-xs mt-2 font-light animate-pulse">
      ✕ {error}
    </p>
  );
}

/**
 * Form Field Success Indicator
 * Shows green checkmark when field is valid
 */
interface FormSuccessProps {
  isValid?: boolean;
  touched?: boolean;
}

export function FormSuccess({ isValid, touched }: FormSuccessProps) {
  if (!touched || !isValid) {
    return null;
  }

  return (
    <p className="text-green-600 text-xs mt-2 font-light">
      ✓ Valido
    </p>
  );
}

/**
 * Form Field Wrapper
 * Combines error and success states with styling
 */
interface FormFieldProps {
  label: string;
  error?: string;
  isValid?: boolean;
  touched?: boolean;
  hint?: string;
  icon?: string;
  children: React.ReactNode;
}

export function FormField({
  label,
  error,
  isValid,
  touched,
  hint,
  icon,
  children,
}: FormFieldProps) {
  const hasError = touched && error;
  const showSuccess = touched && isValid && !error;

  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-[0.3em] text-gray-500 block font-light flex items-center gap-2">
        {icon && <span className="text-lg">{icon}</span>}
        {label}
      </label>

      <div className="relative">
        {children}

        {/* Validation indicator */}
        {hasError && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500 text-lg">
            ✕
          </div>
        )}
        {showSuccess && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-600 text-lg">
            ✓
          </div>
        )}
      </div>

      {/* Error message */}
      {hasError && (
        <p className="text-red-500 text-xs font-light">
          {error}
        </p>
      )}

      {/* Helper text */}
      {hint && !hasError && (
        <p className="text-gray-400 text-xs font-light">
          {hint}
        </p>
      )}
    </div>
  );
}

/**
 * Form Submit Error Alert
 * Displays errors that occurred during form submission
 */
interface FormSubmitErrorProps {
  error?: string | null;
}

export function FormSubmitError({ error }: FormSubmitErrorProps) {
  if (!error) {
    return null;
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
      <p className="text-red-800 text-sm font-light">
        <span className="font-semibold">⚠️ Errore:</span> {error}
      </p>
      <p className="text-red-700 text-xs mt-2 font-light">
        Riprova più tardi o contattaci direttamente via WhatsApp.
      </p>
    </div>
  );
}

/**
 * Form Submit Success Banner
 * Shows confirmation with booking reference
 */
interface FormSubmitSuccessProps {
  bookingRef?: string;
  visible?: boolean;
}

export function FormSubmitSuccess({ bookingRef, visible }: FormSubmitSuccessProps) {
  if (!visible) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-green-600 text-white py-6 px-6 text-center animate-pulse">
      <h3 className="text-2xl font-light mb-2">✓ Prenotazione Inviata!</h3>
      <p className="font-light mb-2">
        Grazie per la prenotazione. Ti contatteremo entro 24 ore per confermare.
      </p>
      {bookingRef && (
        <p className="text-sm bg-green-700 rounded px-3 py-1 inline-block mt-2 font-mono">
          Ref: {bookingRef}
        </p>
      )}
    </div>
  );
}
