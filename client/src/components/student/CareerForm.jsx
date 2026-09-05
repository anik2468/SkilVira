const CareerForm = ({ form, setForm }) => {
  const update = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="mb-6 text-2xl font-bold">
        Career Preferences
      </h2>

      <div className="grid gap-6 md:grid-cols-2">

        <div>
          <label className="mb-2 block font-medium">
            Preferred Role
          </label>

          <input
            name="preferredRole"
            value={form.preferredRole}
            onChange={update}
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Preferred Location
          </label>

          <input
            name="preferredLocation"
            value={form.preferredLocation}
            onChange={update}
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Work Mode
          </label>

          <select
            name="workMode"
            value={form.workMode}
            onChange={update}
            className="w-full rounded-xl border p-3"
          >
            <option value="">Select</option>
            <option>Remote</option>
            <option>Hybrid</option>
            <option>Onsite</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Expected Stipend (₹/month)
          </label>

          <input
            type="number"
            name="expectedStipend"
            value={form.expectedStipend}
            onChange={update}
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div className="flex items-center gap-3 md:col-span-2">
          <input
            type="checkbox"
            checked={form.profileVisibility}
            onChange={(e) =>
              setForm({
                ...form,
                profileVisibility: e.target.checked,
              })
            }
          />

          <label className="font-medium">
            Make my profile visible to recruiters
          </label>
        </div>

      </div>

    </div>
  );
};

export default CareerForm;