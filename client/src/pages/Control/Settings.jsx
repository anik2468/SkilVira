const Settings = () => {
  return (
    <div className="bg-white rounded-2xl shadow p-8">

      <h1 className="text-3xl font-bold">
        Control Settings
      </h1>

      <div className="space-y-5 mt-8">

        <div className="border rounded-xl p-5">
          Platform Settings
        </div>

        <div className="border rounded-xl p-5">
          Security
        </div>

        <div className="border rounded-xl p-5">
          Notification
        </div>

      </div>

    </div>
  );
};

export default Settings;