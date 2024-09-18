import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthSetter = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Extract the token from the URL parameters
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');

    if (token) {
      // Store the token in local storage
      localStorage.setItem('authToken', token);

      // Redirect to the /home route
      navigate('/home');
    } else {
      // Handle the case where the token is not present
      console.error('No token found in the URL');
      navigate('/'); // Redirect to the home or login page
    }
  }, [navigate]);

  return (
    <div>
      {/* You can show a loading spinner or message here if needed */}
      <p>Setting up your authentication...</p>
    </div>
  );
};

export default AuthSetter;
