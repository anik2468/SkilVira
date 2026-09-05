const Topbar = () => {

const user =
JSON.parse(
localStorage.getItem("user")
);


return (

<header className="flex h-16 items-center justify-between border-b bg-white px-6">


<h2 className="text-xl font-semibold">
Employee Dashboard
</h2>


<p className="text-gray-600">
{user?.name || "Employee"}
</p>


</header>

);

};


export default Topbar;