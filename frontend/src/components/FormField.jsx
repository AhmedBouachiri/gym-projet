import { useId } from "react";
import "./FormField.css";

/**
 * Labeled input with inline validation error support.
 * `endAdornment` lets callers add e.g. a show/hide password toggle.
 */
function FormField({
    label,
    error,
    endAdornment,
    id,
    ...inputProps
}) {
    const generatedId = useId();
    const fieldId = id || generatedId;
    const errorId = `${fieldId}-error`;

    return (
        <div className="field">
            <label htmlFor={fieldId} className="field__label">
                {label}
            </label>
            <div className={`field__control${error ? " field__control--error" : ""}`}>
                <input
                    id={fieldId}
                    className="field__input"
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? errorId : undefined}
                    {...inputProps}
                />
                {endAdornment}
            </div>
            {error && (
                <p className="field__error" id={errorId} role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}

export default FormField;
