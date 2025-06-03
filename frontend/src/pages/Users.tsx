import { useEffect, useState } from "react"
import { getAllUsers, type IUser } from "../api/user"

const Users = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const allUsers = await getAllUsers();
        setUsers(allUsers);
      } catch (err) {
        setError('Failed to get all users');
      }
    };

    getUsers();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>User List</h2>
      {error && <p>{error}</p>}
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              <strong>{user.fullName}</strong> ({user.researcherId}) — {user.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Users;
