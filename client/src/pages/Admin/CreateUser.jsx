import { useState } from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiLock,
  FiMail,
  FiRefreshCw,
  FiShield,
  FiUser,
  FiUserPlus,
  FiUsers,
} from "react-icons/fi";

import api from "../../services/api";

const GOLD = "#D4AF37";

const CreateUser = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const changeHandler = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const submitHandler = async (
    e
  ) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setError(
        "Full name is required."
      );
      return;
    }

    if (!form.email.trim()) {
      setError(
        "Email address is required."
      );
      return;
    }

    if (!form.password) {
      setError(
        "Password is required."
      );
      return;
    }

    if (
      form.password.length < 6
    ) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await api.post(
        "/control/users/create",
        {
          name: form.name.trim(),
          email:
            form.email
              .trim()
              .toLowerCase(),
          password:
            form.password,
          role: form.role,
        }
      );

      setForm({
        name: "",
        email: "",
        password: "",
        role: "student",
      });

      setSuccess(
        "User account created successfully."
      );
    } catch (err) {
      console.error(
        "CREATE USER ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to create user."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      role: "student",
    });

    setError("");
    setSuccess("");
  };

  const roleInfo = {
    student: {
      title: "Student",
      description:
        "Learning, internships and course access.",
      icon: <FiUsers />,
    },

    recruiter: {
      title: "Recruiter",
      description:
        "Hiring and internship management access.",
      icon: <FiUser />,
    },

    ambassador: {
      title: "College Ambassador",
      description:
        "Referral, community and campus networking access.",
      icon: <FiShield />,
    },

    employee: {
      title: "Employee",
      description:
        "Internal platform operations access.",
      icon: <FiLock />,
    },
  };

  return (
    <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* HERO */}
        <section className="relative overflow-hidden rounded-[32px] bg-black p-6 text-white shadow-2xl sm:p-8 lg:p-10">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#D4AF37]/20 blur-3xl" />

          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <FiShield
                  size={14}
                  style={{
                    color: GOLD,
                  }}
                />

                <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-300">
                  Admin User Control
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Create User
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-400 sm:text-base">
                Create platform accounts for students, recruiters,
                ambassadors or internal employees from the admin
                control center.
              </p>
            </div>

            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl text-black"
              style={{
                backgroundColor: GOLD,
              }}
            >
              <FiUserPlus size={25} />
            </div>
          </div>
        </section>

        {/* ALERTS */}
        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-semibold text-red-700">
            <FiAlertCircle className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm font-semibold text-emerald-700">
            <FiCheckCircle className="mt-0.5 shrink-0" />
            {success}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">

          {/* FORM */}
          <section className="rounded-[30px] border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-7">
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{
                  color: GOLD,
                }}
              >
                Account Builder
              </p>

              <h2 className="mt-1 text-2xl font-black text-gray-950">
                New platform account
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Fill in the account details and select the role that
                should receive access.
              </p>
            </div>

            <form
              onSubmit={submitHandler}
              className="space-y-5"
            >
              <Field
                label="Full Name"
                name="name"
                value={form.name}
                onChange={changeHandler}
                placeholder="Enter full name"
                icon={<FiUser />}
                required
              />

              <Field
                label="Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={changeHandler}
                placeholder="name@example.com"
                icon={<FiMail />}
                required
              />

              <Field
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={changeHandler}
                placeholder="Minimum 6 characters"
                icon={<FiLock />}
                required
              />

              <div>
                <label className="mb-2 block text-sm font-black text-gray-800">
                  Account Role
                </label>

                <select
                  name="role"
                  value={form.role}
                  onChange={changeHandler}
                  className="w-full rounded-2xl border border-gray-200 bg-[#FAFAF8] px-4 py-3 text-sm font-medium outline-none focus:border-[#D4AF37] focus:bg-white"
                >
                  <option value="student">
                    Student
                  </option>

                  <option value="recruiter">
                    Recruiter
                  </option>

                  <option value="ambassador">
                    College Ambassador
                  </option>

                  <option value="employee">
                    Employee
                  </option>
                </select>
              </div>

              <div className="rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-4">
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-black"
                    style={{
                      backgroundColor:
                        GOLD,
                    }}
                  >
                    {
                      roleInfo[
                        form.role
                      ]?.icon
                    }
                  </div>

                  <div>
                    <p className="text-sm font-black text-gray-900">
                      {
                        roleInfo[
                          form.role
                        ]?.title
                      }
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-600">
                      {
                        roleInfo[
                          form.role
                        ]?.description
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-black text-gray-700"
                >
                  <FiRefreshCw />
                  Reset
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-black text-black disabled:opacity-50"
                  style={{
                    backgroundColor: GOLD,
                  }}
                >
                  <FiUserPlus />

                  {loading
                    ? "Creating Account..."
                    : "Create User"}
                </button>
              </div>
            </form>
          </section>

          {/* ROLE INFO */}
          <div className="space-y-6">

            <section className="rounded-[30px] bg-black p-6 text-white shadow-2xl sm:p-7">
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{
                  color: GOLD,
                }}
              >
                Access Model
              </p>

              <h2 className="mt-1 text-2xl font-black">
                Role-based platform
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                Every account receives access based on its role. Keep
                internal employee access restricted to trusted platform
                operations.
              </p>

              <div className="mt-6 space-y-3">
                {Object.entries(
                  roleInfo
                ).map(
                  ([
                    key,
                    info,
                  ]) => (
                    <button
                      type="button"
                      key={key}
                      onClick={() =>
                        setForm(
                          (prev) => ({
                            ...prev,
                            role: key,
                          })
                        )
                      }
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        form.role === key
                          ? "border-[#D4AF37]/50 bg-[#D4AF37]/10"
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-xl text-black"
                          style={{
                            backgroundColor:
                              GOLD,
                          }}
                        >
                          {info.icon}
                        </div>

                        <div>
                          <p className="text-sm font-black text-white">
                            {info.title}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-gray-500">
                            {info.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                )}
              </div>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-black"
                  style={{
                    backgroundColor:
                      GOLD,
                  }}
                >
                  <FiShield />
                </div>

                <div>
                  <h3 className="text-base font-black text-gray-900">
                    Admin responsibility
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Create accounts only for verified users and assign
                    the minimum role required for their responsibilities.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

const Field = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
  required = false,
}) => (
  <div>
    <label className="mb-2 flex items-center gap-2 text-sm font-black text-gray-800">
      {icon && (
        <span className="text-gray-400">
          {icon}
        </span>
      )}

      {label}

      {required && (
        <span className="text-red-500">
          *
        </span>
      )}
    </label>

    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full rounded-2xl border border-gray-200 bg-[#FAFAF8] px-4 py-3 text-sm font-medium outline-none focus:border-[#D4AF37] focus:bg-white"
    />
  </div>
);

export default CreateUser;