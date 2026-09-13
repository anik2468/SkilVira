import {
  FiUser,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";


const PersonalForm = ({
  formData,
  setFormData,
  form,
  setForm,
}) => {
  const data =
    formData || form || {};

  const updateForm =
    setFormData || setForm;


  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    if (!updateForm) {
      return;
    }

    updateForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
      {/* Header */}
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
          <FiUser />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Personal Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Keep your basic personal details accurate and up to date.
          </p>
        </div>
      </div>


      {/* Form */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Phone */}
        <FormField
          label="Phone Number"
          name="phone"
          value={data?.phone}
          onChange={handleChange}
          type="tel"
          inputMode="numeric"
          placeholder="9876543210"
        />


        {/* DOB */}
        <FormField
          label="Date of Birth"
          name="dateOfBirth"
          value={
            data?.dateOfBirth
              ? String(
                  data.dateOfBirth
                ).substring(
                  0,
                  10
                )
              : ""
          }
          onChange={handleChange}
          type="date"
        />


        {/* Gender */}
        <div>
          <label
            htmlFor="personal-gender"
            className="mb-2 block text-sm font-semibold text-gray-800"
          >
            Gender
          </label>

          <select
            id="personal-gender"
            name="gender"
            value={
              data?.gender || ""
            }
            onChange={
              handleChange
            }
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10"
          >
            <option value="">
              Select Gender
            </option>

            <option value="Male">
              Male
            </option>

            <option value="Female">
              Female
            </option>

            <option value="Other">
              Other
            </option>
          </select>
        </div>


        {/* Country */}
        <FormField
          label="Country"
          name="country"
          value={
            data?.country ||
            "India"
          }
          onChange={handleChange}
          placeholder="India"
        />


        {/* Address */}
        <div className="md:col-span-2">
          <label
            htmlFor="personal-address"
            className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800"
          >
            <FiMapPin
              size={15}
              className="text-[#D4AF37]"
            />

            Address
          </label>

          <textarea
            id="personal-address"
            rows={3}
            name="address"
            value={
              data?.address || ""
            }
            onChange={
              handleChange
            }
            placeholder="Enter your full address"
            className="w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10"
          />
        </div>


        {/* City */}
        <FormField
          label="City"
          name="city"
          value={data?.city}
          onChange={handleChange}
          placeholder="Enter city"
        />


        {/* State */}
        <FormField
          label="State"
          name="state"
          value={data?.state}
          onChange={handleChange}
          placeholder="Enter state"
        />


        {/* Pincode */}
        <FormField
          label="Pincode"
          name="pincode"
          value={data?.pincode}
          onChange={handleChange}
          type="text"
          inputMode="numeric"
          placeholder="Enter pincode"
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
  placeholder,
}) => {
  return (
    <div>
      <label
        htmlFor={`personal-${name}`}
        className="mb-2 block text-sm font-semibold text-gray-800"
      >
        {label}
      </label>

      <div className="relative">
        {name === "phone" && (
          <FiPhone
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
        )}

        <input
          id={`personal-${name}`}
          type={type}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          inputMode={inputMode}
          placeholder={placeholder}
          className={`w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 ${
            name === "phone"
              ? "pl-10"
              : ""
          }`}
        />
      </div>
    </div>
  );
};


export default PersonalForm;