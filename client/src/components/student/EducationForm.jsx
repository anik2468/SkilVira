import {
  FiBookOpen,
} from "react-icons/fi";


const EducationForm = ({
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


  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
      {/* Header */}
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
          <FiBookOpen />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Education
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Add your academic background and current
            education details.
          </p>
        </div>
      </div>


      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <FormField
          label="College"
          name="college"
          value={form?.college}
          onChange={update}
          placeholder="Enter college name"
        />

        <FormField
          label="University"
          name="university"
          value={form?.university}
          onChange={update}
          placeholder="Enter university name"
        />

        <FormField
          label="Degree"
          name="degree"
          value={form?.degree}
          onChange={update}
          placeholder="e.g. B.Tech"
        />

        <FormField
          label="Branch"
          name="branch"
          value={form?.branch}
          onChange={update}
          placeholder="e.g. Computer Science & Engineering"
        />

        <FormField
          label="Semester"
          name="semester"
          value={form?.semester}
          onChange={update}
          placeholder="e.g. 2nd Semester"
        />

        <FormField
          label="Passing Year"
          name="passingYear"
          value={form?.passingYear}
          onChange={update}
          type="number"
          inputMode="numeric"
          placeholder="e.g. 2028"
        />

        <FormField
          label="CGPA"
          name="cgpa"
          value={form?.cgpa}
          onChange={update}
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          max="10"
          placeholder="e.g. 8.25"
        />

        <FormField
          label="10th Percentage"
          name="tenthPercentage"
          value={form?.tenthPercentage}
          onChange={update}
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          max="100"
          placeholder="e.g. 81"
        />

        <FormField
          label="12th Percentage"
          name="twelfthPercentage"
          value={form?.twelfthPercentage}
          onChange={update}
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          max="100"
          placeholder="e.g. 70"
        />
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
  step,
  min,
  max,
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
        step={step}
        min={min}
        max={max}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10"
      />
    </div>
  );
};


export default EducationForm;