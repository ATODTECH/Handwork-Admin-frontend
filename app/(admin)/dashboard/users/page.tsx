import UserManagementIndex from '@/modules/users-management';
import { Metadata, NextPage } from 'next'

export const metadata: Metadata = {
  title: "User management - HandworkExpert",
  description: "",
};

const UserManagement: NextPage = () => {
  return (
    <>
      <UserManagementIndex />
    </>
  )
}

export default UserManagement