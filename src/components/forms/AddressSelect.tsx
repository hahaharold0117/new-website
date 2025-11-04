import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAddressApiKey } from "@/constants/Config";

type Props = {
  label: string;
  name: string;
  postcode: string;
  value: string;
  onSelect: (addr: string) => void;
  error?: string;
  required?: boolean;
  id?: string;
  className?: string;
};

export default function AddressSelect({
  label,
  name,
  postcode,
  value,
  onSelect,
  error = "",
  required = false,
  id,
  className = "",
}: Props) {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [fetchedFor, setFetchedFor] = useState<string>("");

  const fieldId = id || `field-${name}`;

  // Clear options when postcode changes
  useEffect(() => {
    setOptions([]);
    setFetchedFor("");
  }, [postcode]);

  const fetchSuggestions = async () => {
    const pc = (postcode || "").trim().toUpperCase();
    if (!pc) return; // no value → nothing to fetch
    if (fetchedFor === pc && options.length) return; // already fetched for this value

    try {
      setLoading(true);
      const url = `https://api.getAddress.io/find/${encodeURIComponent(pc)}?api-key=${getAddressApiKey}`;
      const res = await axios.get(url);
      const addrs: string[] = Array.isArray(res?.data?.addresses) ? res.data.addresses : [];

      const withPc = addrs
        .map(a => (a || "").trim())
        .filter(Boolean)
        .map(a => (a.toUpperCase().includes(pc) ? a : `${a}, ${pc}`));

      const uniq = Array.from(new Set(withPc));
      setOptions(uniq);
      setFetchedFor(pc);
    } catch (err) {
      console.error("Address lookup failed:", err);
      // optional: global?.showErrorToast?.("", "Address lookup failed");
    } finally {
      setLoading(false);
    }
  };

  const hasPostcode = !!(postcode && postcode.trim());

  return (
    <div className={`flex flex-col ${className}`}>
      <label htmlFor={fieldId} className="mb-1 font-medium">
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      <select
        id={fieldId}
        name={name}
        className={`rounded-lg border px-3 py-2 outline-none ${
          error ? "border-red-500" : "border-neutral-300"
        }`}
        value={value || ""}
        onFocus={fetchSuggestions}
        onMouseDown={fetchSuggestions}
        onChange={e => onSelect(e.target.value)}
        disabled={!hasPostcode || loading}
        aria-busy={loading}
      >
        {!hasPostcode ? (
          <option value="">Enter a postcode first</option>
        ) : loading ? (
          <option value="">Loading addresses…</option>
        ) : options.length ? (
          <>
            <option value="">Select your address</option>
            {options.map((opt, idx) => (
              <option key={`${opt}-${idx}`} value={opt}>
                {opt}
              </option>
            ))}
          </>
        ) : (
          <option value="">Focus/click to fetch suggestions</option>
        )}
      </select>

      {error ? <span className="mt-1 text-sm text-red-600">{error}</span> : null}
    </div>
  );
}
