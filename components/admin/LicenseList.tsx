import React from 'react';

// Mock data for demonstration
const licenses = [
  { id: 1, key: 'ABC-123', type: 'premium', expiration: '2024-12-31' },
  { id: 2, key: 'DEF-456', type: 'basic', expiration: '2024-10-15' },
  { id: 3, key: 'GHI-789', type: 'enterprise', expiration: '2025-01-01' },
];

const LicenseList: React.FC = () => {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Existing Licenses</h3>
      <ul className="space-y-2">
        {licenses.map((license) => (
          <li key={license.id} className="p-4 border rounded flex justify-between items-center">
            <div>
              <p className="font-bold">{license.key}</p>
              <p>Type: {license.type}</p>
              <p>Expires: {license.expiration}</p>
            </div>
            <button className="bg-red-500 text-white p-2 rounded hover:bg-red-600">
              Revoke
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LicenseList;