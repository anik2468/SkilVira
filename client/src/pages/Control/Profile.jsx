const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="bg-white rounded-2xl shadow p-8">

      <h1 className="text-3xl font-bold">
        Control Profile
      </h1>

      <div className="mt-8 space-y-4">

        <div>
          <b>Name :</b> {user?.name}
        </div>

        <div>
          <b>Email :</b> {user?.email}
        </div>

        <div>
          <b>Role :</b> {user?.role}
        </div>

      </div>

    </div>
  );
};

export default Profile;