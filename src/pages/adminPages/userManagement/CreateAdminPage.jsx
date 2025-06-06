import React, { useState } from 'react';
import CreateAdmin from './CreateAdmin';
import OtpCrossCheck from '../../OtpCrosscheck/OtpCrossCheck';

const CreateAdminPage = () => {
  const [newAdminOTPToken, setNewAdminOTPToken] = useState(null);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      {newAdminOTPToken ? (
        <OtpCrossCheck adminOTPToken={newAdminOTPToken} />
      ) : (
        <CreateAdmin setNewAdminOTPToken={setNewAdminOTPToken} />
      )}
    </div>
  );
};

export default CreateAdminPage;