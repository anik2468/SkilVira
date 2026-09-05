const PersonalForm = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="rounded-3xl bg-white p-8 shadow">

      <h2 className="mb-8 text-2xl font-bold">
        Personal Information
      </h2>

      <div className="grid gap-6 md:grid-cols-2">

        <div>
          <label className="mb-2 block font-medium">
            Phone Number
          </label>

          <input
            type="text"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
            placeholder="9876543210"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Date of Birth
          </label>

          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth || ""}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Gender
          </label>

          <select
            name="gender"
            value={formData.gender || ""}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Country
          </label>

          <input
            type="text"
            name="country"
            value={formData.country || ""}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block font-medium">
            Address
          </label>

          <textarea
            rows="3"
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            City
          </label>

          <input
            type="text"
            name="city"
            value={formData.city || ""}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            State
          </label>

          <input
            type="text"
            name="state"
            value={formData.state || ""}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Pincode
          </label>

          <input
            type="text"
            name="pincode"
            value={formData.pincode || ""}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          />
        </div>

      </div>

    </div>
  );
};

export default PersonalForm;