'use client';
import useUsers from '../hooks/useUsers';

export default function Home() {
  const users = useUsers();

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-3">User IDs</h1>
      <ul className="list-disc pl-5">
        {users.map(user => (
          <li key={user.id} className="mb-1">User ID: {user.id}</li>
        ))}
      </ul>
    </div>
  );
}
