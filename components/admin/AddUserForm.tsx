import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

interface AddUserFormProps {
  onUserAdded: () => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onUserAdded }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!email) {
      setError('Email is required.');
      return;
    }

    const { error } = await supabase
      .from('whitelisted_users')
      .insert([{ email }]);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setEmail('');
      onUserAdded();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex">
        <input
          type="email"
          placeholder="Enter email to whitelist"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-grow p-2 border rounded-l"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-r">
          Add User
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">User added successfully!</p>}
    </form>
  );
};

export default AddUserForm;