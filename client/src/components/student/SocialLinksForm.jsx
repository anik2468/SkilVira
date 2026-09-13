import {
  FiExternalLink,
  FiLink,
} from "react-icons/fi";


const SocialLinksForm = ({
  form,
  setForm,
}) => {
  const update = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  const fields = [
    {
      label: "GitHub",
      name: "github",
      placeholder:
        "https://github.com/username",
    },
    {
      label: "LinkedIn",
      name: "linkedin",
      placeholder:
        "https://linkedin.com/in/username",
    },
    {
      label: "Portfolio",
      name: "portfolio",
      placeholder:
        "https://yourportfolio.com",
    },
    {
      label: "LeetCode",
      name: "leetcode",
      placeholder:
        "https://leetcode.com/username",
    },
    {
      label: "GeeksforGeeks",
      name: "geeksforgeeks",
      placeholder:
        "https://geeksforgeeks.org/user/username",
    },
    {
      label: "HackerRank",
      name: "hackerrank",
      placeholder:
        "https://hackerrank.com/username",
    },
    {
      label: "Codeforces",
      name: "codeforces",
      placeholder:
        "https://codeforces.com/profile/username",
    },
    {
      label: "CodeChef",
      name: "codechef",
      placeholder:
        "https://codechef.com/users/username",
    },
  ];


  const openLink = (
    value
  ) => {
    if (!value) {
      return;
    }

    let url = value.trim();

    if (
      !url.startsWith(
        "http://"
      ) &&
      !url.startsWith(
        "https://"
      )
    ) {
      url = `https://${url}`;
    }

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };


  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
      {/* Header */}
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
          <FiLink />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Social Links
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Add links to your professional and coding profiles.
          </p>
        </div>
      </div>


      {/* Fields */}
      <div className="grid gap-5 md:grid-cols-2">
        {fields.map(
          (field) => {
            const value =
              form?.[
                field.name
              ] || "";

            return (
              <div
                key={
                  field.name
                }
              >
                <label
                  htmlFor={
                    field.name
                  }
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  {field.label}
                </label>

                <div className="flex gap-2">
                  <div className="relative min-w-0 flex-1">
                    <FiLink
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id={
                        field.name
                      }
                      type="url"
                      name={
                        field.name
                      }
                      value={
                        value
                      }
                      onChange={
                        update
                      }
                      placeholder={
                        field.placeholder
                      }
                      className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10"
                    />
                  </div>

                  {value && (
                    <button
                      type="button"
                      onClick={() =>
                        openLink(
                          value
                        )
                      }
                      title={`Open ${field.label}`}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 hover:text-[#8B6E12]"
                    >
                      <FiExternalLink
                        size={17}
                      />
                    </button>
                  )}
                </div>

                {value && (
                  <p className="mt-1.5 truncate text-xs text-gray-400">
                    {value}
                  </p>
                )}
              </div>
            );
          }
        )}
      </div>


      {/* Tip */}
      <div className="mt-6 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-4">
        <p className="text-xs leading-5 text-gray-600">
          Keep your professional profile links
          updated so recruiters can easily review
          your work and achievements.
        </p>
      </div>
    </section>
  );
};


export default SocialLinksForm;