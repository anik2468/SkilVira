import { Link } from "react-router-dom";

const actions = [
  {
    title: "Post Internship",
    link: "/recruiter/post",
  },
  {
    title: "View Applications",
    link: "/recruiter/applications",
  },
  {
    title: "Company Profile",
    link: "/recruiter/profile",
  },
];

const QuickActions = () => {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg">

      <h2 className="mb-6 text-2xl font-bold">
        Quick Actions
      </h2>

      <div className="space-y-4">

        {actions.map((action) => (
          <Link
            key={action.title}
            to={action.link}
            className="block rounded-xl bg-[#D4AF37] px-5 py-4 text-center font-semibold text-white transition hover:opacity-90"
          >
            {action.title}
          </Link>
        ))}

      </div>

    </div>
  );
};

export default QuickActions;