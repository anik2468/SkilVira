import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import api from "../../services/api";

const emptySettings = {
  studentReferralDiscountEnabled: false,
  studentReferralDiscountType: "percent",
  studentReferralDiscountValue: 0,
  ambassadorCommissionEnabled: true,
  ambassadorCommissionType: "percent",
  ambassadorCommissionValue: 15,
};

const listFrom = (response, key) => {
  const data = response?.data;
  if (Array.isArray(data?.[key])) return data[key];
  if (Array.isArray(data?.data?.[key])) return data.data[key];
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data)) return data;
  return [];
};

const settingsFrom = (product) => ({
  studentReferralDiscountEnabled: product?.studentReferralDiscountEnabled === true,
  studentReferralDiscountType: product?.studentReferralDiscountType === "fixed" ? "fixed" : "percent",
  studentReferralDiscountValue: Number(product?.studentReferralDiscountValue || 0),
  ambassadorCommissionEnabled: product?.ambassadorCommissionEnabled !== false,
  ambassadorCommissionType: product?.ambassadorCommissionType === "fixed" ? "fixed" : "percent",
  ambassadorCommissionValue: Number(product?.ambassadorCommissionValue ?? 15),
});

export default function ReferralPricingSettings() {
  const navigate = useNavigate();
  const location = useLocation();
  const isControl = location.pathname.startsWith("/control");
  const [type, setType] = useState("course");
  const [courses, setCourses] = useState([]);
  const [internships, setInternships] = useState([]);
  const [productId, setProductId] = useState("");
  const [form, setForm] = useState(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    Promise.allSettled([api.get("/courses"), api.get("/internships")])
      .then(([courseResult, internshipResult]) => {
        if (!active) return;

        const c = courseResult.status === "fulfilled"
          ? listFrom(courseResult.value, "courses") : [];
        const i = internshipResult.status === "fulfilled"
          ? listFrom(internshipResult.value, "internships") : [];

        setCourses(c);
        setInternships(i);

        if (c.length) {
          setType("course");
          setProductId(String(c[0]._id));
        } else if (i.length) {
          setType("internship");
          setProductId(String(i[0]._id));
        } else {
          setError("No courses or internships were returned for your account.");
        }
      })
      .catch((err) => {
        if (active) setError(err?.response?.data?.message || "Unable to load products.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  const products = type === "course" ? courses : internships;
  const selected = products.find((item) => String(item._id) === String(productId));

  useEffect(() => {
    setForm(selected ? settingsFrom(selected) : emptySettings);
  }, [productId, type, courses, internships]);

  const changeType = (nextType) => {
    const nextProducts = nextType === "course" ? courses : internships;
    setType(nextType);
    setProductId(nextProducts.length ? String(nextProducts[0]._id) : "");
    setError("");
    setMessage("");
  };

  const save = async (event) => {
    event.preventDefault();
    if (!selected || saving) return;

    const discount = Number(form.studentReferralDiscountValue);
    const commission = Number(form.ambassadorCommissionValue);

    if (!Number.isFinite(discount) || discount < 0 ||
        !Number.isFinite(commission) || commission < 0) {
      setError("Discount and commission must be zero or greater.");
      return;
    }
    if (form.studentReferralDiscountType === "percent" && discount > 100) {
      setError("Discount percentage cannot exceed 100%.");
      return;
    }
    if (form.ambassadorCommissionType === "percent" && commission > 100) {
      setError("Commission percentage cannot exceed 100%.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const endpoint = type === "course" ? "courses" : "internships";
      await api.put(`/${endpoint}/${productId}`, {
        ...form,
        studentReferralDiscountValue: discount,
        ambassadorCommissionValue: commission,
      });

      const updater = (items) => items.map((item) =>
        String(item._id) === String(productId)
          ? { ...item, ...form,
              studentReferralDiscountValue: discount,
              ambassadorCommissionValue: commission }
          : item
      );

      if (type === "course") setCourses(updater);
      else setInternships(updater);

      setMessage("Referral discount and ambassador commission saved.");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Unable to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-600">Loading referral settings…</div>;

  return (
    <main className="min-h-screen bg-[#F8F8F6] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={() => navigate(isControl ? "/control/courses" : "/employee/courses")}
          className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-gray-600"
        >
          <FiArrowLeft /> Back to courses
        </button>

        <h1 className="text-3xl font-black text-gray-950">
          Referral Discount & Commission
        </h1>
        <p className="mt-2 mb-6 text-sm text-gray-600">
          Student discount and ambassador commission are independent settings. Configure each product separately.
        </p>

        <form onSubmit={save} className="space-y-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold text-gray-800">
              Product type
              <select
                value={type}
                onChange={(e) => changeType(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-3"
              >
                <option value="course">Course</option>
                <option value="internship">Internship</option>
              </select>
            </label>

            <label className="text-sm font-bold text-gray-800">
              Select product
              <select
                value={productId}
                onChange={(e) => { setProductId(e.target.value); setMessage(""); }}
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-3"
                required
              >
                {products.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.title || item.name || "Untitled"}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {!selected ? (
            <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
              No products available for this type.
            </p>
          ) : (
            <>
              <section className="rounded-xl border border-gray-200 p-4">
                <h2 className="font-black text-gray-950">Student referral discount</h2>
                <label className="mt-4 flex items-center gap-3 text-sm font-semibold">
                  <input
                    type="checkbox"
                    checked={form.studentReferralDiscountEnabled}
                    onChange={(e) => setForm({ ...form, studentReferralDiscountEnabled: e.target.checked })}
                  />
                  Enable discount when referral code is applied
                </label>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-semibold">
                    Discount type
                    <select
                      value={form.studentReferralDiscountType}
                      onChange={(e) => setForm({ ...form, studentReferralDiscountType: e.target.value })}
                      className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-3"
                    >
                      <option value="percent">Percentage (%)</option>
                      <option value="fixed">Fixed amount (₹)</option>
                    </select>
                  </label>
                  <label className="text-sm font-semibold">
                    Discount value
                    <input
                      type="number" min="0" step="0.01"
                      max={form.studentReferralDiscountType === "percent" ? 100 : undefined}
                      value={form.studentReferralDiscountValue}
                      onChange={(e) => setForm({ ...form, studentReferralDiscountValue: e.target.value })}
                      className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-3"
                    />
                  </label>
                </div>
              </section>

              <section className="rounded-xl border border-gray-200 p-4">
                <h2 className="font-black text-gray-950">Ambassador commission</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Calculated separately on the final payable amount.
                </p>
                <label className="mt-4 flex items-center gap-3 text-sm font-semibold">
                  <input
                    type="checkbox"
                    checked={form.ambassadorCommissionEnabled}
                    onChange={(e) => setForm({ ...form, ambassadorCommissionEnabled: e.target.checked })}
                  />
                  Enable commission for this product
                </label>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-semibold">
                    Commission type
                    <select
                      value={form.ambassadorCommissionType}
                      onChange={(e) => setForm({ ...form, ambassadorCommissionType: e.target.value })}
                      className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-3"
                    >
                      <option value="percent">Percentage (%)</option>
                      <option value="fixed">Fixed amount (₹)</option>
                    </select>
                  </label>
                  <label className="text-sm font-semibold">
                    Commission value
                    <input
                      type="number" min="0" step="0.01"
                      max={form.ambassadorCommissionType === "percent" ? 100 : undefined}
                      value={form.ambassadorCommissionValue}
                      onChange={(e) => setForm({ ...form, ambassadorCommissionValue: e.target.value })}
                      className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-3"
                    />
                  </label>
                </div>
              </section>
            </>
          )}

          {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          {message && <p role="status" className="rounded-xl bg-green-50 p-3 text-sm text-green-700">{message}</p>}

          <button
            type="submit"
            disabled={!selected || saving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 font-black text-gray-950 disabled:opacity-50"
          >
            <FiSave /> {saving ? "Saving…" : "Save settings"}
          </button>
        </form>
      </div>
    </main>
  );
}
