const ProjectsForm = ({ form, setForm }) => {

  const addProject = () => {
    setForm({
      ...form,
      projects: [
        ...form.projects,
        {
          title: "",
          description: "",
          github: "",
          live: "",
        },
      ],
    });
  };

  const updateProject = (index, field, value) => {
    const updated = [...form.projects];

    updated[index][field] = value;

    setForm({
      ...form,
      projects: updated,
    });
  };

  const removeProject = (index) => {
    setForm({
      ...form,
      projects: form.projects.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="rounded-2xl bg-white p-8 shadow">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold">
          Projects
        </h2>

        <button
          onClick={addProject}
          className="rounded-xl bg-[#D4AF37] px-5 py-2 text-white"
        >
          Add Project
        </button>

      </div>

      {form.projects.map((project, index) => (

        <div
          key={index}
          className="mb-6 rounded-xl border p-5"
        >

          <input
            placeholder="Project Title"
            value={project.title}
            onChange={(e)=>
              updateProject(index,"title",e.target.value)
            }
            className="mb-3 w-full rounded-xl border p-3"
          />

          <textarea
            placeholder="Description"
            value={project.description}
            onChange={(e)=>
              updateProject(index,"description",e.target.value)
            }
            className="mb-3 w-full rounded-xl border p-3"
          />

          <input
            placeholder="GitHub Link"
            value={project.github}
            onChange={(e)=>
              updateProject(index,"github",e.target.value)
            }
            className="mb-3 w-full rounded-xl border p-3"
          />

          <input
            placeholder="Live Link"
            value={project.live}
            onChange={(e)=>
              updateProject(index,"live",e.target.value)
            }
            className="w-full rounded-xl border p-3"
          />

          <button
            onClick={()=>removeProject(index)}
            className="mt-4 text-red-500"
          >
            Remove
          </button>

        </div>

      ))}

    </div>
  );
};

export default ProjectsForm;