const StudentNavbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="bg-white border-b px-6 py-4">
      <h2 className="text-2xl font-bold">
        Welcome {user?.name}
      </h2>
    </div>
  );
};

export default StudentNavbar;