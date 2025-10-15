import React, { useEffect, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";


export default function AuthPageModal({ show, onClose, onSuccess }) {
  const [tab, setTab] = useState("login"); // 'login' | 'signup'

  useEffect(() => {
    if (!show) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl border border-neutral-200">

        <div className="border-b border-neutral-200">
          <div
            role="tablist"
            aria-label="Auth"
            className="flex rounded-t-2xl overflow-hidden bg-white"
          >
            <TabButton active={tab === "login"} onClick={() => setTab("login")} side="left">
              SIGN IN
            </TabButton>
            <TabButton active={tab === "signup"} onClick={() => setTab("signup")} side="right">
              SIGN UP
            </TabButton>

            {/* Close button absolutely positioned still ok */}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {tab === "login" ? (
            <LoginForm
              onSuccess={(user) => {
                localStorage.setItem("auth_user", JSON.stringify(user));
                onSuccess?.(user);
              }}
            />
          ) : (
            <SignupForm
              onSuccess={(user) => {
                localStorage.setItem("auth_user", JSON.stringify(user));
                onSuccess?.(user);
              }}
              switchToLogin={() => setTab("login")}
            />
          )}
        </div>

        {/* Close button in corner */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-2 top-2 rounded-md px-2 py-1 text-neutral-600 hover:bg-neutral-100"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children, side }) {
  const edgeRadius =
    side === "left" ? "rounded-tl-2xl" : side === "right" ? "rounded-tr-2xl" : "";
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={[
        "flex-1 px-5 py-3 text-center text-sm font-semibold tracking-wide",
        "uppercase transition border-b",
        active
          ? `bg-[var(--brand)] text-white border-[var(--brand)] ${edgeRadius}`
          : "bg-white text-neutral-800 border-transparent hover:bg-neutral-50",
      ].join(" ")}
    >
      {children}
    </button>
  );
}


/* ---------------- Reusable inputs ---------------- */

function Input({ label, type = "text", value, onChange, placeholder, required, disabled }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-neutral-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full rounded-lg border px-3 py-2 outline-none focus:border-neutral-400 ${disabled ? "bg-neutral-100 border-neutral-200 text-neutral-400" : "bg-white border-neutral-300"
          }`}
      />
    </label>
  );
}

function PasswordInput({ label, value, onChange, placeholder, required }) {
  const [show, setShow] = React.useState(false);

  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-neutral-700">{label}</span>
      <div className="flex items-stretch rounded-lg border border-neutral-300 bg-white">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-l-lg px-3 py-2 outline-none"
        />

        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          aria-pressed={show}
          className="px-3 flex items-center justify-center text-neutral-600 border-l border-neutral-300 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
        >
          {show ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      </div>
    </label>
  );
}


function InlineError({ children }) {
  return (
    <div className="rounded-lg bg-red-50 text-red-700 border border-red-200 px-3 py-2 text-sm">
      {children}
    </div>
  );
}

/* ---------------- Forms ---------------- */

function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const user = await fakeSignIn({ email, password }); // replace with your API
      onSuccess?.(user);
    } catch (e) {
      setErr(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form id="panel-login" role="tabpanel" onSubmit={submit} className="space-y-3">
      <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" required disabled={false}/>
      <PasswordInput label="Password" value={password} onChange={setPw} placeholder="••••••••" required />
      {err && <InlineError>{err}</InlineError>}
      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full rounded-lg bg-[var(--brand)] text-white font-semibold py-2.5 hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}

function SignupForm({ onSuccess, switchToLogin }) {
  const [firstName, setFirst] = useState("");
  const [lastName, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const user = await fakeSignUp({ firstName, lastName, email, phone, password }); // replace with your API
      onSuccess?.(user);
    } catch (e) {
      setErr(e?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form id="panel-signup" role="tabpanel" onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input label="First Name" value={firstName} onChange={setFirst} placeholder="Jane" disabled = {false} required />
        <Input label="Last Name" value={lastName} onChange={setLast} placeholder="Doe" disabled = {false} required />
      </div>
      <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="jane@doe.com" required disabled = {false}/>
      <Input label="Phone" type="tel" value={phone} onChange={setPhone} placeholder="+1 555-555-5555" disabled = {false} required/>
      <PasswordInput label="Password" value={password} onChange={setPw} placeholder="••••••••" required />
      {err && <InlineError>{err}</InlineError>}
      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full rounded-lg bg-[var(--brand)] text-white font-semibold py-2.5 hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Create Account..." : "Create Account"}
      </button>
      <p className="text-sm text-neutral-600 text-center">
        Already have an account?{" "}
        <button type="button" onClick={switchToLogin} className="text-[var(--brand)] hover:underline">
          Sign in
        </button>
      </p>
    </form>
  );
}

/* ---------------- Fake API (replace) ---------------- */

async function fakeSignIn({ email, password }) {
  await sleep(500);
  if (!email || !password) throw new Error("Email and password are required");
  return {
    id: "u_123",
    firstName: "Roman",
    lastName: "Customer",
    email,
    phone: "+1 555-555-0000",
    token: "demo-token",
  };
}

async function fakeSignUp({ firstName, lastName, email, phone, password }) {
  await sleep(700);
  if (!firstName || !lastName || !email || !password)
    throw new Error("Please fill all required fields");
  return { id: "u_456", firstName, lastName, email, phone, token: "demo-token" };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
