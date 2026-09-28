'use client';

import { useCallback, useEffect, useState } from "react";
import { Eye, EyeOff, KeyRound, Pencil, Plus, ShieldCheck, ShieldOff, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { baseAPI } from "../../../config/api";
import { getUser } from "../../../utils/auth";
import DeleteModal from "../../../components/ui/DeleteModal";
import { hasErrors, rules, validate } from "../../../utils/validation";

const MIN_PASSWORD = 8;

const fetchAccounts = () => baseAPI.users.getAll().catch(() => null);

const inputClass =
  "w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#22B2A8] focus:border-transparent";

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";

// Turns the API's validation list ([{ path: 'body.email', message }]) into
// { email: message } for showing under each field.
const fieldErrorsFrom = (response) => {
  const errors = {};
  (Array.isArray(response?.error) ? response.error : []).forEach(({ path, message }) => {
    const field = String(path).replace(/^body\./, "");
    errors[field] ??= message;
  });
  return errors;
};

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
    <div className="bg-white rounded-xl shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>
      {children}
    </div>
  </div>
);

const Field = ({ label, error, children }) => (
  <label className="block">
    <span className="block text-sm font-medium text-gray-700 mb-1.5">{label}</span>
    {children}
    {error && <span className="block mt-1 text-xs text-red-600">{error}</span>}
  </label>
);

const PasswordInput = ({ value, onChange, placeholder, autoComplete = "new-password" }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        minLength={MIN_PASSWORD}
        required
        className={`${inputClass} pr-10`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-0 px-3 text-gray-400 hover:text-gray-600"
      >
        {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
};

const ModalActions = ({ onCancel, saving, label }) => (
  <div className="flex justify-end gap-3 pt-2">
    <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">
      Cancel
    </button>
    <button
      type="submit"
      disabled={saving}
      className="px-4 py-2 rounded-md bg-[#22B2A8] text-white hover:bg-[#1a9d8f] disabled:opacity-60"
    >
      {saving ? "Saving…" : label}
    </button>
  </div>
);

// Add a new admin.
const CreateModal = ({ onClose, onSaved }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const clientErrors = validate(form, {
      name: rules.personName("Full name"),
      email: rules.email(),
      password: rules.password(),
    });
    if (form.password !== form.confirm) clientErrors.confirm = "Passwords do not match";
    if (hasErrors(clientErrors)) {
      setErrors(clientErrors);
      return;
    }
    setSaving(true);
    const response = await baseAPI.users.create({
      name: form.name,
      email: form.email,
      password: form.password,
      role: "admin",
    }).catch(() => null);
    setSaving(false);
    if (response?.success) {
      toast.success(`${form.name} can now sign in`);
      onSaved();
      return;
    }
    setErrors(fieldErrorsFrom(response));
    toast.error(response?.message || "Could not create the account");
  };

  return (
    <Modal title="Add admin" onClose={onClose}>
      <form onSubmit={submit} noValidate className="p-6 space-y-4">
        <Field label="Full name" error={errors.name}>
          <input value={form.name} onChange={set("name")} required maxLength={100} autoComplete="name" className={inputClass} placeholder="e.g. Jane Smith" />
        </Field>
        <Field label="Email" error={errors.email}>
          <input type="email" value={form.email} onChange={set("email")} required autoComplete="email" className={inputClass} placeholder="name@veritaspathways.co.uk" />
        </Field>
        <Field label={`Password (at least ${MIN_PASSWORD} characters, with a letter and a number)`} error={errors.password}>
          <PasswordInput value={form.password} onChange={set("password")} placeholder="Create a password" />
        </Field>
        <Field label="Confirm password" error={errors.confirm}>
          <PasswordInput value={form.confirm} onChange={set("confirm")} placeholder="Repeat the password" />
        </Field>
        <p className="text-xs text-gray-500">
          Share the password with them securely. They can sign in straight away.
        </p>
        <ModalActions onCancel={onClose} saving={saving} label="Add admin" />
      </form>
    </Modal>
  );
};

// Change an account's name or dashboard access.
const EditModal = ({ account, isSelf, onClose, onSaved }) => {
  const [name, setName] = useState(account.name || "");
  const [role, setRole] = useState(account.role);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const clientErrors = validate({ name }, { name: rules.personName("Full name") });
    if (hasErrors(clientErrors)) {
      setErrors(clientErrors);
      return;
    }
    setSaving(true);
    const response = await baseAPI.users.update(account._id, { name, role }).catch(() => null);
    setSaving(false);
    if (response?.success) {
      toast.success("Account updated");
      onSaved();
      return;
    }
    setErrors(fieldErrorsFrom(response));
    toast.error(response?.message || "Could not update the account");
  };

  return (
    <Modal title="Edit account" onClose={onClose}>
      <form onSubmit={submit} noValidate className="p-6 space-y-4">
        <p className="text-sm text-gray-600">{account.email}</p>
        <Field label="Full name" error={errors.name}>
          <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={100} className={inputClass} />
        </Field>
        <Field label="Access" error={errors.role}>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={isSelf}
            className={`${inputClass} disabled:bg-gray-100`}
          >
            <option value="admin">Admin: full dashboard access</option>
            <option value="user">No access: cannot sign in</option>
          </select>
          {isSelf && <span className="block mt-1 text-xs text-gray-500">You cannot change your own access.</span>}
        </Field>
        <ModalActions onCancel={onClose} saving={saving} label="Save changes" />
      </form>
    </Modal>
  );
};

// Set a new password for an account.
const PasswordModal = ({ account, onClose }) => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const clientErrors = validate({ password }, { password: rules.password() });
    if (password !== confirm) clientErrors.confirm = "Passwords do not match";
    if (hasErrors(clientErrors)) {
      setErrors(clientErrors);
      return;
    }
    setSaving(true);
    const response = await baseAPI.users.resetPassword(account._id, password).catch(() => null);
    setSaving(false);
    if (response?.success) {
      toast.success("Password updated");
      onClose();
      return;
    }
    setErrors(fieldErrorsFrom(response));
    toast.error(response?.message || "Could not update the password");
  };

  return (
    <Modal title="Reset password" onClose={onClose}>
      <form onSubmit={submit} noValidate className="p-6 space-y-4">
        <p className="text-sm text-gray-600">
          Set a new password for <span className="font-medium text-gray-900">{account.name || account.email}</span>.
        </p>
        <Field label={`New password (at least ${MIN_PASSWORD} characters, with a letter and a number)`} error={errors.password}>
          <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" />
        </Field>
        <Field label="Confirm new password" error={errors.confirm}>
          <PasswordInput value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat the password" />
        </Field>
        <ModalActions onCancel={onClose} saving={saving} label="Update password" />
      </form>
    </Modal>
  );
};

const AdminsPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // { type: 'create' | 'edit' | 'password' | 'delete', account }
  const currentUserId = getUser()?._id;

  // State is only set once the response arrives. The first load shows the
  // skeleton (loading starts true); reloads after a change keep the current
  // list on screen until the new one arrives.
  const applyResponse = useCallback((response) => {
    if (response?.success) {
      setAccounts(response.data ?? []);
    } else {
      toast.error(response?.message || "Could not load accounts");
    }
    setLoading(false);
  }, []);

  const load = useCallback(
    () => fetchAccounts().then(applyResponse),
    [applyResponse],
  );

  useEffect(() => {
    let cancelled = false;
    fetchAccounts().then((response) => {
      if (!cancelled) applyResponse(response);
    });
    return () => {
      cancelled = true;
    };
  }, [applyResponse]);

  const closeAndReload = () => {
    setModal(null);
    load();
  };

  const confirmDelete = async () => {
    const response = await baseAPI.users.remove(modal.account._id).catch(() => null);
    if (response?.success) {
      toast.success("Account deleted");
      closeAndReload();
    } else {
      toast.error(response?.message || "Could not delete the account");
      setModal(null);
    }
  };

  const admins = accounts.filter((a) => a.role === "admin");
  const others = accounts.filter((a) => a.role !== "admin");

  const renderRow = (account) => {
    const isSelf = account._id === currentUserId;
    const isAdmin = account.role === "admin";
    return (
      <li key={account._id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <span
            className={`flex items-center justify-center w-11 h-11 rounded-full shrink-0 font-semibold ${
              isAdmin ? "bg-[#22B2A8]/15 text-[#158e88]" : "bg-gray-100 text-gray-500"
            }`}
            aria-hidden="true"
          >
            {(account.name || account.email).charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 truncate">
              {account.name || <span className="text-gray-400 italic">No name</span>}
              {isSelf && (
                <span className="ml-2 align-middle px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">You</span>
              )}
            </p>
            <p className="text-sm text-gray-500 truncate">{account.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
              isAdmin ? "bg-[#22B2A8]/10 text-[#158e88]" : "bg-gray-100 text-gray-500"
            }`}
          >
            {isAdmin ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldOff className="w-3.5 h-3.5" />}
            {isAdmin ? "Admin" : "No access"}
          </span>
          <span className="text-xs text-gray-500 w-24">Added {formatDate(account.createdAt)}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setModal({ type: "edit", account })}
              title="Edit"
              aria-label={`Edit ${account.email}`}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => setModal({ type: "password", account })}
              title="Reset password"
              aria-label={`Reset password for ${account.email}`}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <KeyRound className="w-4 h-4" />
            </button>
            <button
              onClick={() => setModal({ type: "delete", account })}
              disabled={isSelf}
              title={isSelf ? "You cannot delete your own account" : "Delete"}
              aria-label={`Delete ${account.email}`}
              className="p-2 rounded-md text-red-600 hover:bg-red-50 disabled:text-gray-300 disabled:hover:bg-transparent"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </li>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Management</h2>
          <p className="text-sm text-gray-600 mt-1">Who can sign in to this dashboard</p>
        </div>
        <button
          onClick={() => setModal({ type: "create" })}
          className="flex items-center gap-2 px-4 py-2 bg-[#22B2A8] text-white rounded-md hover:bg-[#1a9d8f] transition whitespace-nowrap"
        >
          <Plus className="h-4 w-4" />
          Add admin
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow divide-y divide-gray-100">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-5 flex items-center gap-4 animate-pulse">
              <div className="w-11 h-11 rounded-full bg-gray-200" />
              <div className="space-y-2">
                <div className="h-4 w-40 bg-gray-200 rounded" />
                <div className="h-3 w-56 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <section>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Admins ({admins.length})
            </h3>
            <ul className="bg-white rounded-lg shadow divide-y divide-gray-100">{admins.map(renderRow)}</ul>
          </section>

          {others.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Other accounts ({others.length})
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                These accounts cannot sign in. Edit one to give it admin access, or delete it.
              </p>
              <ul className="bg-white rounded-lg shadow divide-y divide-gray-100">{others.map(renderRow)}</ul>
            </section>
          )}
        </>
      )}

      {modal?.type === "create" && <CreateModal onClose={() => setModal(null)} onSaved={closeAndReload} />}
      {modal?.type === "edit" && (
        <EditModal
          account={modal.account}
          isSelf={modal.account._id === currentUserId}
          onClose={() => setModal(null)}
          onSaved={closeAndReload}
        />
      )}
      {modal?.type === "password" && <PasswordModal account={modal.account} onClose={() => setModal(null)} />}
      <DeleteModal
        isOpen={modal?.type === "delete"}
        onClose={() => setModal(null)}
        onConfirm={confirmDelete}
        title="Delete account"
        message={
          modal?.type === "delete"
            ? `Delete ${modal.account.name || modal.account.email}? They will no longer be able to sign in. This cannot be undone.`
            : ""
        }
      />
    </div>
  );
};

export default AdminsPage;
