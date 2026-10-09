import { useState, useEffect } from 'react';
import { userService } from '../../../services';
import { DEFAULT_USERS } from '../mockData/usersMocks';

export function useUsers() {
  const [users, setUsers] = useState(DEFAULT_USERS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    userService.getUsers()
      .then((data) => {
        if (mounted && data) setUsers(data);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const totalCount = users.length;
  const adminCount = users.filter((u) => u.role === 'Admin').length;
  const userCount = users.filter((u) => u.role === 'User').length;
  const disabledCount = users.filter((u) => u.status === 'Disabled').length;

  return {
    users,
    setUsers,
    loading,
    totalCount,
    adminCount,
    userCount,
    disabledCount,
  };
}

export default useUsers;
