import React from 'react';
import CreateLicenseForm from './CreateLicenseForm.tsx';
import LicenseList from './LicenseList.tsx';

const LicenseManager: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">License Management</h2>
      <CreateLicenseForm />
      <LicenseList />
    </div>
  );
};

export default LicenseManager;