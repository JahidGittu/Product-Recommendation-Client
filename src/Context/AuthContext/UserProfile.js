
import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';

const useProfile = () => {
  const { user } = useAuth()

  const [profileData, setProfileData] = useState({
    fullName: '',
    dob: '',
    phone: '',
    address: '',
    email: user?.email || '',
    photo: '',
    gender: '',
    hobbies: '',
  });

  const accessToken = user?.accessToken

  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:5000/users?email=${user.email}`, {
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data) {
            setProfileData(prev => ({ ...prev, ...data }));
          }
        });
    }
  }, [user?.email]);

  return { profileData, setProfileData };
};

export default useProfile;
