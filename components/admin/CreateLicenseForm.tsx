import React, { useState } from 'react';

const CreateLicenseForm: React.FC = () => {
  const [licenseKey, setLicenseKey] = useState('');
  const [licenseType, setLicenseType] = useState('basic');
  const [expirationDate, setExpirationDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to create license will be added here
    console.log({ licenseKey, licenseType, expirationDate });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <h3 className="text-xl font-bold mb-4">Create New License</h3>
      <div className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="License Key"
          value={licenseKey}
          onChange={(e) => setLicenseKey(e.target.value)}
          className="p-2 border rounded"
        />
        <select
          value={licenseType}
          onChange={(e) => setLicenseType(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="basic">Basic</option>
          <option value="premium">Premium</option>
          <option value="enterprise">Enterprise</option>
        </select>
        <input
          type="date"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
          className="p-2 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Create License
        </button>
      </div>
    </form>
  );
};

export default CreateLicenseForm;