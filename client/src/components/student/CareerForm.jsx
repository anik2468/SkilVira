import {
  FiBriefcase,
  FiMapPin,
  FiEye,
} from "react-icons/fi";


const CareerForm = ({
  form,
  setForm,
}) => {
  const update = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  const updateVisibility = (
    event
  ) => {
    const checked =
      event.target.checked;

    setForm((previous) => ({
      ...previous,
      profileVisibility:
        checked,
    }));
  };


  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
      {/* Header */}
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
          <FiBriefcase />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Career Preferences
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Tell us what kind of opportunities you are looking for.
          </p>
        </div>
      </div>


      {/* Fields */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Preferred Role */}
        <FormField
          label="Preferred Role"
          name="preferredRole"
          value={
            form?.preferredRole
          }
          onChange={update}
          placeholder="e.g. Full Stack Developer"
        />


        {/* Preferred Location */}
        <FormField
          label="Preferred Location"
          name="preferredLocation"
          value={
            form?.preferredLocation
          }
          onChange={update}
          placeholder="e.g. Bengaluru, Remote"
        />


        {/* Work Mode */}
        <div>
          <label
            htmlFor="workMode"
            className="mb-2 block text-sm font-semibold text-gray-800"
          >
            Work Mode
          </label>

          <select
            id="workMode"
            name="workMode"
            value={
              form?.workMode || ""
            }
            onChange={update}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10"
          >
            <option value="">
              Select Work Mode
            </option>

            <option value="Remote">
              Remote
            </option>

            <option value="Hybrid">
              Hybrid
            </option>

            <option value="Onsite">
              Onsite
            </option>
          </select>
        </div>


        {/* Expected Stipend */}
        <FormField
          label="Expected Stipend (₹/month)"
          name="expectedStipend"
          value={
            form?.expectedStipend
          }
          onChange={update}
          type="number"
          inputMode="numeric"
          min="0"
          placeholder="e.g. 15000"
        />


        {/* Visibility */}
        <div className="md:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={
                  form?.profileVisibility !==
                  false
                }
                onChange={
                  updateVisibility
                }
                className="mt-1 h-4 w-4 accent-[#D4AF37]"
              />

              <span>
                <span className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <FiEye
                    size={15}
                    className="text-[#D4AF37]"
                  />

                  Make my profile visible to recruiters
                </span>

                <span className="mt-1 block text-xs leading-5 text-gray-500">
                  Recruiters can discover your profile
                  based on the information you provide.
                </span>
              </span>
            </label>
          </div>
        </div>
      </div>
    </section>
  );
};


// =====================================================
// FORM FIELD
// =====================================================

const FormField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  inputMode,
  min,
  placeholder,
}) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-gray-800"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value ?? ""}
        onChange={onChange}
        inputMode={inputMode}
        min={min}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10"
      />
    </div>
  );
};


export default CareerForm;