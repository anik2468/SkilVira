import { useEffect, useState } from "react";
import api from "../../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const { data } = await api.get("/control/dashboard");
      setStats(data.stats || {});
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="space-y-8">

      <h1 className="text-4xl font-bold">
        Control Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {Object.entries(stats).map(([key, value]) => (

          <div
            key={key}
            className="rounded-2xl bg-white p-6 shadow"
          >
            <h2 className="text-4xl font-bold">
              {value}
            </h2>

            <p className="mt-2 capitalize text-gray-500">
              {key}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
};

export default Dashboard;