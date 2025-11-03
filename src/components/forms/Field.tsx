export default function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  error = "",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  error?: string;
}) {
  const id = `field-${name}`;
  const invalid = !!error;
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-1 block text-sm font-medium text-neutral-700">
        {label}
      </span>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        aria-invalid={invalid}
        aria-describedby={invalid ? `${id}-error` : undefined}
        className={`w-full rounded-lg border bg-white px-3 py-2 outline-none ring-0 focus:border-neutral-400 ${invalid ? "border-red-500 focus:border-red-500" : "border-neutral-300"
          }`}
      />
      {invalid && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </label>
  );
}
