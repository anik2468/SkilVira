import { Link } from "react-router-dom";

const communities = [
  {
    id: 1,
    college: "Government Engineering College Sheikhpura",
    members: "1,240",
    platform: "WhatsApp",
    color: "bg-green-500",
  },
  {
    id: 2,
    college: "NIT Patna",
    members: "2,850",
    platform: "Telegram",
    color: "bg-blue-500",
  },
  {
    id: 3,
    college: "IIT Patna",
    members: "3,150",
    platform: "Discord",
    color: "bg-indigo-500",
  },
];

const StudentCommunities = () => {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-14 text-center">
          <h2 className="text-4xl font-bold">
            Student Communities
          </h2>

          <p className="mt-4 text-gray-600">
            Join your college community, connect with seniors, juniors, and
            classmates.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {communities.map((community) => (
            <div
              key={community.id}
              className="rounded-3xl border bg-white p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-xl"
            >
              <div
                className={`mb-6 inline-flex rounded-full px-4 py-2 text-sm font-semibold text-white ${community.color}`}
              >
                {community.platform}
              </div>

              <h3 className="text-xl font-bold">
                {community.college}
              </h3>

              <p className="mt-3 text-gray-500">
                {community.members} Members
              </p>

              <Link
                to={`/community/${community.id}`}
                className="mt-8 block rounded-xl bg-[#D4AF37] py-3 text-center font-semibold text-white transition hover:opacity-90"
              >
                Join Community
              </Link>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default StudentCommunities;