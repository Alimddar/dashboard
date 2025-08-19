import { users } from '@/lib/data';
import { UserManagementClient } from './user-management-client';

export default function UsersPage() {
  const initialUsers = users;
  return <UserManagementClient initialUsers={initialUsers} />;
}
