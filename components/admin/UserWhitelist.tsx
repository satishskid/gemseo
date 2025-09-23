import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import AddUserForm from './AddUserForm';
import UserList from './UserList';

const UserWhitelist = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('whitelisted_users')
      .select('id, email, created_at');

    if (error) {
      setError(error.message);
    } else {
      setUsers(data);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserAdded = () => {
    fetchUsers();
  };

  const handleUserRemoved = () => {
    fetchUsers();
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User Whitelist</h2>
      {error && <p className="text-red-500">{error}</p>}
      <AddUserForm onUserAdded={handleUserAdded} />
      <UserList users={users} onUserRemoved={handleUserRemoved} />
    </div>
  );
};

export default UserWhitelist;