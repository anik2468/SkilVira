import { useEffect, useState } from "react";
import api from "../../services/api";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data } = await api.get("/control/users");
    setUsers(data.users || []);
  };

  return (
    <div className="bg-white rounded-2xl shadow p-8">

      <h1 className="mb-6 text-3xl font-bold">
        Users
      </h1>

      <table className="w-full">

        <thead>

          <tr className="border-b">

            <th className="text-left p-3">
              Name
            </th>

            <th>Email</th>

            <th>Role</th>

          </tr>

        </thead>

        <tbody>

          {users.map((user) => (

            <tr
              key={user._id}
              className="border-b"
            >

              <td className="p-3">
                {user.name}
              </td>

              <td>{user.email}</td>

              <td>{user.role}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default Users;