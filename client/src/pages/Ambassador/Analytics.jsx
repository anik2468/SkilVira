const Analytics = () => {
  return (
    <div className="bg-white rounded-2xl shadow p-8">

      <h1 className="text-3xl font-bold">
        Analytics
      </h1>

      <div className="grid gap-6 mt-8 md:grid-cols-3">

        <div className="rounded-xl border p-6">
          <h2 className="text-4xl font-bold">0</h2>
          <p>Clicks</p>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="text-4xl font-bold">0</h2>
          <p>Registrations</p>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="text-4xl font-bold">0</h2>
          <p>Conversions</p>
        </div>

      </div>

    </div>
  );
};

export default Analytics;