const Analytics = () => {
  return (
    <div className="bg-white rounded-2xl shadow p-8">

      <h1 className="text-3xl font-bold">
        Analytics
      </h1>

      <div className="grid gap-6 mt-8 md:grid-cols-2 xl:grid-cols-4">

        <div className="border rounded-xl p-6">
          <h2 className="text-4xl font-bold">0</h2>
          <p>Total Visits</p>
        </div>

        <div className="border rounded-xl p-6">
          <h2 className="text-4xl font-bold">0</h2>
          <p>New Users</p>
        </div>

        <div className="border rounded-xl p-6">
          <h2 className="text-4xl font-bold">0</h2>
          <p>Applications</p>
        </div>

        <div className="border rounded-xl p-6">
          <h2 className="text-4xl font-bold">0</h2>
          <p>Certificates</p>
        </div>

      </div>

    </div>
  );
};

export default Analytics;