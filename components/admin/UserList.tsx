import React from 'react';
import { supabase } from '../../lib/supabaseClient';

interface User {
  id: number;
  email: string;
}

interface UserListProps {
  users: User[];
  onUserRemoved: () => void;
}

const UserList: React.FC<UserListProps> = ({ users, onUserRemoved }) => {
  const handleRemove = async (userId: number) => {
    const { error } = await supabase
      .from('whitelisted_users')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('Error removing user:', error);
    } else {
      onUserRemoved();
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-2">Whitelisted Users</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="flex justify-between items-center p-2 border-b border-gray-700">
            <span className="text-white">{user.email}</span>
            <button
              onClick={() => handleRemove(user.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;