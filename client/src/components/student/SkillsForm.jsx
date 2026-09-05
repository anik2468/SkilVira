import { useState } from "react";

const SkillsForm = ({ form, setForm }) => {
  const [skill, setSkill] = useState("");

  const addSkill = () => {
    if (!skill.trim()) return;

    if (form.skills.includes(skill.trim())) return;

    setForm({
      ...form,
      skills: [...form.skills, skill.trim()],
    });

    setSkill("");
  };

  const removeSkill = (index) => {
    setForm({
      ...form,
      skills: form.skills.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="mb-6 text-2xl font-bold">
        Skills
      </h2>

      <div className="flex gap-3">

        <input
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          placeholder="Add Skill"
          className="flex-1 rounded-xl border p-3"
        />

        <button
          onClick={addSkill}
          className="rounded-xl bg-[#D4AF37] px-6 text-white"
        >
          Add
        </button>

      </div>

      <div className="mt-6 flex flex-wrap gap-3">

        {form.skills.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 rounded-full bg-yellow-100 px-4 py-2"
          >
            {item}

            <button
              onClick={() => removeSkill(index)}
              className="font-bold text-red-500"
            >
              ×
            </button>

          </div>
        ))}

      </div>

    </div>
  );
};

export default SkillsForm;