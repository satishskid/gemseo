import React, { useState } from 'react';
import { testEmailConfiguration } from '../../services/emailService';

const EmailTest: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleTestEmail = async () => {
    setTesting(true);
    setResult(null);

    try {
      const response = await testEmailConfiguration();
      
      if (response.success) {
        setResult({ 
          success: true, 
          message: 'Email configuration test successful! The Resend API is working correctly.' 
        });
      } else {
        setResult({ 
          success: false, 
          message: `Email test failed: ${response.error}` 
        });
      }
    } catch (error) {
      setResult({ 
        success: false, 
        message: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-3">📧 Email Configuration Test</h3>
      <p className="text-gray-300 text-sm mb-4">
        Test if the email notification system is properly configured and working.
      </p>
      
      <button
        onClick={handleTestEmail}
        disabled={testing}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          testing 
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
        }`}
      >
        {testing ? '📧 Testing...' : '📧 Test Email Configuration'}
      </button>

      {result && (
        <div className={`mt-4 p-3 rounded-lg ${
          result.success 
            ? 'bg-green-900/20 border border-green-700' 
            : 'bg-red-900/20 border border-red-700'
        }`}>
          <p className={`text-sm ${
            result.success ? 'text-green-300' : 'text-red-300'
          }`}>
            {result.message}
          </p>
        </div>
      )}
    </div>
  );
};

export default EmailTest;