import { useMemo, useState } from "react";

import {
  FiCheck,
  FiSearch,
  FiX,
  FiCode,
} from "react-icons/fi";


const AVAILABLE_SKILLS = [
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


const SkillsSelector = ({
  formData,
  setFormData,
  form,
  setForm,
}) => {
  const [search, setSearch] =
    useState("");


  // ===================================================
  // Support both existing prop styles
  // ===================================================

  const data =
    formData || form || {};

  const updateForm =
    setFormData || setForm;


  const selectedSkills =
    Array.isArray(data.skills)
      ? data.skills
      : [];


  // ===================================================
  // Toggle
  // ===================================================

  const toggleSkill = (
    skill
  ) => {
    if (!updateForm) {
      return;
    }

    const exists =
      selectedSkills.some(
        (item) =>
          String(item).toLowerCase() ===
          skill.toLowerCase()
      );

    const updatedSkills =
      exists
        ? selectedSkills.filter(
            (item) =>
              String(item).toLowerCase() !==
              skill.toLowerCase()
          )
        : [
            ...selectedSkills,
            skill,
          ];

    updateForm(
      (previous) => ({
        ...previous,
        skills:
          updatedSkills,
      })
    );
  };


  // ===================================================
  // Remove
  // ===================================================

  const removeSkill = (
    skill
  ) => {
    if (!updateForm) {
      return;
    }

    updateForm(
      (previous) => ({
        ...previous,
        skills: (
          Array.isArray(
            previous?.skills
          )
            ? previous.skills
            : []
        ).filter(
          (item) =>
            String(item).toLowerCase() !==
            String(skill).toLowerCase()
        ),
      })
    );
  };


  // ===================================================
  // Filter
  // ===================================================

  const filteredSkills =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      if (!keyword) {
        return AVAILABLE_SKILLS;
      }

      return AVAILABLE_SKILLS.filter(
        (skill) =>
          skill
            .toLowerCase()
            .includes(keyword)
      );
    }, [search]);


  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
      {/* Header */}
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
          <FiCode />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Select Skills
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Choose the skills that best represent
            your technical and professional abilities.
          </p>
        </div>
      </div>


      {/* Search */}
      <div className="relative">
        <FiSearch
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          placeholder="Search skills..."
          className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#D4AF37] focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/10"
        />
      </div>


      {/* Selected Count */}
      <div className="mt-5 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          <span className="font-bold text-gray-900">
            {selectedSkills.length}
          </span>{" "}
          {selectedSkills.length === 1
            ? "skill"
            : "skills"}{" "}
          selected
        </p>

        {selectedSkills.length >
          0 && (
          <button
            type="button"
            onClick={() => {
              if (!updateForm) {
                return;
              }

              updateForm(
                (previous) => ({
                  ...previous,
                  skills: [],
                })
              );
            }}
            className="text-xs font-semibold text-red-500 hover:text-red-600"
          >
            Clear All
          </button>
        )}
      </div>


      {/* Available Skills */}
      <div className="mt-5 flex max-h-72 flex-wrap gap-2 overflow-y-auto pr-1">
        {filteredSkills.length >
        0 ? (
          filteredSkills.map(
            (skill) => {
              const selected =
                selectedSkills.some(
                  (item) =>
                    String(
                      item
                    ).toLowerCase() ===
                    skill.toLowerCase()
                );

              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() =>
                    toggleSkill(
                      skill
                    )
                  }
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                    selected
                      ? "border-[#D4AF37] bg-[#D4AF37] text-white"
                      : "border-gray-200 bg-gray-50 text-gray-700 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 hover:text-[#8B6E12]"
                  }`}
                >
                  {selected && (
                    <FiCheck
                      size={14}
                    />
                  )}

                  {skill}
                </button>
              );
            }
          )
        ) : (
          <div className="w-full rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
            <FiSearch
              size={26}
              className="mx-auto text-gray-300"
            />

            <p className="mt-2 text-sm font-medium text-gray-600">
              No matching skills
            </p>
          </div>
        )}
      </div>


      {/* Selected Skills */}
      <div className="mt-7 border-t border-gray-100 pt-6">
        <h3 className="text-lg font-bold text-gray-900">
          Selected Skills
        </h3>

        {selectedSkills.length >
        0 ? (
          <div className="mt-4 flex flex-wrap gap-2.5">
            {selectedSkills.map(
              (skill, index) => (
                <div
                  key={`${skill}-${index}`}
                  className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3.5 py-2 text-sm font-medium text-green-700"
                >
                  <FiCheck
                    size={14}
                  />

                  <span>
                    {skill}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      removeSkill(
                        skill
                      )
                    }
                    className="flex h-5 w-5 items-center justify-center rounded-full text-green-600 transition hover:bg-red-100 hover:text-red-500"
                    title={`Remove ${skill}`}
                  >
                    <FiX size={13} />
                  </button>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
            <FiCode
              size={28}
              className="mx-auto text-gray-300"
            />

            <p className="mt-3 text-sm font-medium text-gray-600">
              No skills selected
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Select skills from the list above.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};


export default SkillsSelector;