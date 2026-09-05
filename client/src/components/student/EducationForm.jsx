const EducationForm = ({ form, setForm }) => {
  const update = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="mb-6 text-2xl font-bold">
        Education
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        <input
          placeholder="College"
          name="college"
          value={form.college}
          onChange={update}
          className="rounded-xl border p-3"
        />

        <input
          placeholder="University"
          name="university"
          value={form.university}
          onChange={update}
          className="rounded-xl border p-3"
        />

        <input
          placeholder="Degree"
          name="degree"
          value={form.degree}
          onChange={update}
          className="rounded-xl border p-3"
        />

        <input
          placeholder="Branch"
          name="branch"
          value={form.branch}
          onChange={update}
          className="rounded-xl border p-3"
        />

        <input
          placeholder="Semester"
          name="semester"
          value={form.semester}
          onChange={update}
          className="rounded-xl border p-3"
        />

        <input
          placeholder="Passing Year"
          name="passingYear"
          value={form.passingYear}
          onChange={update}
          className="rounded-xl border p-3"
        />

        <input
          placeholder="CGPA"
          name="cgpa"
          value={form.cgpa}
          onChange={update}
          className="rounded-xl border p-3"
        />

        <input
          placeholder="10th Percentage"
          name="tenthPercentage"
          value={form.tenthPercentage}
          onChange={update}
          className="rounded-xl border p-3"
        />

        <input
          placeholder="12th Percentage"
          name="twelfthPercentage"
          value={form.twelfthPercentage}
          onChange={update}
          className="rounded-xl border p-3"
        />

      </div>

    </div>
  );
};

export default EducationForm;