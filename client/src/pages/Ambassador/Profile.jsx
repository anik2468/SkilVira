const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="bg-white rounded-2xl shadow p-8">

      <h1 className="text-3xl font-bold">
        Ambassador Profile
      </h1>

      <div className="mt-8 space-y-4">

        <p><b>Name:</b> {user?.name}</p>

        <p><b>Email:</b> {user?.email}</p>

        <p><b>Role:</b> {user?.role}</p>

      </div>

    </div>
  );
};

export default Profile;