const Topbar = () => {

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );


  return (

    <header className="flex h-16 items-center justify-between border-b bg-white px-6">


      <h2 className="text-xl font-semibold">
        Ambassador Dashboard
      </h2>


      <div className="text-sm text-gray-600">

        {user?.name || "Ambassador"}

      </div>


    </header>

  );

};


export default Topbar;