const SocialLinksForm = ({ form, setForm }) => {
  const update = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const fields = [
    { label: "GitHub", name: "github" },
    { label: "LinkedIn", name: "linkedin" },
    { label: "Portfolio", name: "portfolio" },
    { label: "LeetCode", name: "leetcode" },
    { label: "GeeksforGeeks", name: "geeksforgeeks" },
    { label: "HackerRank", name: "hackerrank" },
    { label: "Codeforces", name: "codeforces" },
    { label: "CodeChef", name: "codechef" },
  ];

  return (
    <div className="rounded-2xl bg-white p-8 shadow">
      <h2 className="mb-6 text-2xl font-bold">
        Social Links
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="mb-2 block font-medium">
              {field.label}
            </label>

            <input
              type="text"
              name={field.name}
              value={form[field.name] || ""}
              onChange={update}
              className="w-full rounded-xl border p-3"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialLinksForm;