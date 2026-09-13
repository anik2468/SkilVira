import {
  FiFolder,
  FiPlus,
  FiTrash2,
  FiGithub,
  FiExternalLink,
} from "react-icons/fi";

const ProjectsForm = ({
  form,
  setForm,
}) => {
  const projects = Array.isArray(
    form?.projects
  )
    ? form.projects
    : [];


  // ======================================
  // Add Project
  // ======================================

  const addProject = () => {
    setForm((previous) => ({
      ...previous,

      projects: [
        ...(Array.isArray(
          previous?.projects
        )
          ? previous.projects
          : []),

        {
          title: "",
          description: "",
          github: "",
          live: "",
        },
      ],
    }));
  };


  // ======================================
  // Update Project
  // ======================================

  const updateProject = (
    index,
    field,
    value
  ) => {
    setForm((previous) => {
      const current =
        Array.isArray(
          previous?.projects
        )
          ? previous.projects
          : [];

      const updated =
        current.map(
          (project, projectIndex) =>
            projectIndex === index
              ? {
                  ...project,
                  [field]: value,
                }
              : project
        );

      return {
        ...previous,
        projects: updated,
      };
    });
  };


  // ======================================
  // Remove Project
  // ======================================

  const removeProject = (
    index
  ) => {
    setForm((previous) => ({
      ...previous,

      projects: (
        Array.isArray(
          previous?.projects
        )
          ? previous.projects
          : []
      ).filter(
        (_, projectIndex) =>
          projectIndex !== index
      ),
    }));
  };


  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
            <FiFolder />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Projects
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Showcase the projects that demonstrate your
              skills and experience.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={addProject}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#b99520]"
        >
          <FiPlus />
          Add Project
        </button>
      </div>


      {/* Projects */}
      {projects.length > 0 ? (
        <div className="mt-6 space-y-6">
          {projects.map(
            (
              project,
              index
            ) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
              >
                {/* Project Header */}
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D4AF37]/10 text-sm font-bold text-[#8B6E12]">
                      {index + 1}
                    </span>

                    <span className="text-sm font-bold text-gray-800">
                      Project {index + 1}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeProject(
                        index
                      )
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                  >
                    <FiTrash2 />
                    Remove
                  </button>
                </div>


                <div className="grid gap-5">
                  {/* Title */}
                  <FormField
                    label="Project Title"
                    value={
                      project?.title
                    }
                    onChange={(event) =>
                      updateProject(
                        index,
                        "title",
                        event.target.value
                      )
                    }
                    placeholder="e.g. College ERP System"
                  />


                  {/* Description */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-800">
                      Description
                    </label>

                    <textarea
                      rows={5}
                      value={
                        project?.description ||
                        ""
                      }
                      onChange={(
                        event
                      ) =>
                        updateProject(
                          index,
                          "description",
                          event.target
                            .value
                        )
                      }
                      placeholder="Describe what you built, the problem it solves and the technologies you used..."
                      className="w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10"
                    />
                  </div>


                  {/* Links */}
                  <div className="grid gap-5 md:grid-cols-2">
                    <LinkField
                      label="GitHub Link"
                      icon={<FiGithub />}
                      value={
                        project?.github
                      }
                      onChange={(
                        event
                      ) =>
                        updateProject(
                          index,
                          "github",
                          event.target
                            .value
                        )
                      }
                      placeholder="https://github.com/username/project"
                    />

                    <LinkField
                      label="Live Project Link"
                      icon={
                        <FiExternalLink />
                      }
                      value={
                        project?.live
                      }
                      onChange={(
                        event
                      ) =>
                        updateProject(
                          index,
                          "live",
                          event.target
                            .value
                        )
                      }
                      placeholder="https://your-project.com"
                    />
                  </div>


                  {/* Link Preview */}
                  {(project?.github ||
                    project?.live) && (
                    <div className="flex flex-wrap gap-3">
                      {project?.github && (
                        <a
                          href={
                            project.github
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-gray-700 ring-1 ring-gray-200 transition hover:text-[#8B6E12]"
                        >
                          <FiGithub />
                          Open GitHub
                        </a>
                      )}

                      {project?.live && (
                        <a
                          href={
                            project.live
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-gray-700 ring-1 ring-gray-200 transition hover:text-[#8B6E12]"
                        >
                          <FiExternalLink />
                          Open Live Project
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
          <FiFolder
            size={34}
            className="mx-auto text-gray-300"
          />

          <p className="mt-3 text-sm font-semibold text-gray-600">
            No projects added yet
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Add your best projects to strengthen your
            student profile.
          </p>
        </div>
      )}
    </section>
  );
};


// =====================================================
// FORM FIELD
// =====================================================

const FormField = ({
  label,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-800">
        {label}
      </label>

      <input
        type="text"
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10"
      />
    </div>
  );
};


// =====================================================
// LINK FIELD
// =====================================================

const LinkField = ({
  label,
  icon,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-800">
        {label}
      </label>

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </span>

        <input
          type="url"
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10"
        />
      </div>
    </div>
  );
};


export default ProjectsForm;