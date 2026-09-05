import { useState } from "react";

const availableSkills = [
  "C",
  "C++",
  "Java",
  "Python",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Express.js",
  "MongoDB",
  "MySQL",
  "PostgreSQL",
  "HTML",
  "CSS",
  "Tailwind CSS",
  "Bootstrap",
  "Git",
  "GitHub",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "Firebase",
  "Machine Learning",
  "Artificial Intelligence",
  "Data Science",
  "Cyber Security",
  "UI/UX",
  "Figma",
];

const SkillsSelector = ({ formData, setFormData }) => {
  const [search, setSearch] = useState("");

  const selectedSkills = formData.skills || [];

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setFormData({
        ...formData,
        skills: selectedSkills.filter((item) => item !== skill),
      });
    } else {
      setFormData({
        ...formData,
        skills: [...selectedSkills, skill],
      });
    }
  };

  const filteredSkills = availableSkills.filter((skill) =>
    skill.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rounded-3xl bg-white p-8 shadow">
      <h2 className="mb-6 text-2xl font-bold">
        Skills
      </h2>

      <input
        type="text"
        placeholder="Search Skill..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full rounded-xl border p-3"
      />

      <div className="flex flex-wrap gap-3">
        {filteredSkills.map((skill) => (
          <button
            key={skill}
            type="button"
            onClick={() => toggleSkill(skill)}
            className={`rounded-full px-5 py-2 transition ${
              selectedSkills.includes(skill)
                ? "bg-[#D4AF37] text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {skill}
          </button>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="mb-3 text-lg font-semibold">
          Selected Skills
        </h3>

        <div className="flex flex-wrap gap-3">
          {selectedSkills.length > 0 ? (
            selectedSkills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-green-100 px-4 py-2 text-green-700"
              >
                {skill}
              </span>
            ))
          ) : (
            <p className="text-gray-500">
              No skills selected.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillsSelector;