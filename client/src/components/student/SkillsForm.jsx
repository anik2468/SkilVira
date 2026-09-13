import { useState } from "react";

import {
  FiPlus,
  FiX,
  FiCode,
} from "react-icons/fi";


const SkillsForm = ({
  form,
  setForm,
}) => {
  const [skill, setSkill] =
    useState("");


  // ======================================
  // Add Skill
  // ======================================

  const addSkill = () => {
    const value =
      skill.trim();

    if (!value) {
      return;
    }

    const currentSkills =
      Array.isArray(form?.skills)
        ? form.skills
        : [];

    const alreadyExists =
      currentSkills.some(
        (item) =>
          String(item).trim().toLowerCase() ===
          value.toLowerCase()
      );

    if (alreadyExists) {
      setSkill("");
      return;
    }

    setForm((previous) => ({
      ...previous,
      skills: [
        ...(Array.isArray(
          previous?.skills
        )
          ? previous.skills
          : []),
        value,
      ],
    }));

    setSkill("");
  };


  // ======================================
  // Remove Skill
  // ======================================

  const removeSkill = (
    index
  ) => {
    setForm((previous) => ({
      ...previous,
      skills: (
        Array.isArray(
          previous?.skills
        )
          ? previous.skills
          : []
      ).filter(
        (_, skillIndex) =>
          skillIndex !== index
      ),
    }));
  };


  // ======================================
  // Enter Key
  // ======================================

  const handleKeyDown = (
    event
  ) => {
    if (
      event.key ===
      "Enter"
    ) {
      event.preventDefault();
      addSkill();
    }
  };


  const skills =
    Array.isArray(form?.skills)
      ? form.skills
      : [];


  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
      {/* Header */}
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
          <FiCode />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Skills
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Add the technical and professional
            skills you want to showcase.
          </p>
        </div>
      </div>


      {/* Add Skill */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={skill}
          onChange={(event) =>
            setSkill(
              event.target.value
            )
          }
          onKeyDown={
            handleKeyDown
          }
          placeholder="e.g. React, Node.js, Python"
          className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10"
        />

        <button
          type="button"
          onClick={addSkill}
          disabled={!skill.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#b99520] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FiPlus />
          Add Skill
        </button>
      </div>


      {/* Skill Count */}
      <div className="mt-5 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {skills.length}{" "}
          {skills.length === 1
            ? "skill"
            : "skills"} added
        </p>

        {skills.length > 0 && (
          <span className="text-xs text-gray-400">
            Press Enter to add quickly
          </span>
        )}
      </div>


      {/* Skills */}
      {skills.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2.5">
          {skills.map(
            (item, index) => (
              <div
                key={`${item}-${index}`}
                className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-3.5 py-2 text-sm font-medium text-[#8B6E12]"
              >
                <span>
                  {item}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    removeSkill(
                      index
                    )
                  }
                  className="flex h-5 w-5 items-center justify-center rounded-full text-[#8B6E12] transition hover:bg-red-100 hover:text-red-500"
                  title={`Remove ${item}`}
                >
                  <FiX size={14} />
                </button>
              </div>
            )
          )}
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
          <FiCode
            size={28}
            className="mx-auto text-gray-300"
          />

          <p className="mt-3 text-sm font-medium text-gray-600">
            No skills added yet
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Add skills that represent your strengths.
          </p>
        </div>
      )}
    </section>
  );
};


export default SkillsForm;