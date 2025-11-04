// @ts-nocheck  ← must be the first line if you use it

import React from "react";

export default function FieldWithIcon({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  type = "text",
  required = false,
  error = "",
  icon = undefined,        // <-- default = optional
  inputProps = {},         // <-- default
  className = "",
  inputId = undefined,     // <-- default = optional
}) {
  const id = inputId || `field-${name}`;
  const invalid = !!error;
  const showIcon = icon !== false;

  return (
    <label className={`block ${className}`} htmlFor={id}>
      {label ? (
        <span className="mb-1 block text-sm font-medium text-neutral-700">
          {label}
        </span>
      ) : null}

      <div className="relative">
        {showIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
            {icon ?? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" />
              </svg>
            )}
          </span>
        )}

        <input
          {...inputProps}
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          aria-invalid={invalid}
          aria-describedby={invalid ? `${id}-error` : undefined}
          className={
            `w-full rounded-lg bg-white px-3 py-2 outline-none ring-0 focus:border-neutral-400 border ` +
            `${showIcon ? "pl-9 " : ""}` +
            `${invalid ? "border-red-500 focus:border-red-500" : "border-neutral-300"}`
          }
        />
      </div>

      {invalid && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </label>
  );
}
