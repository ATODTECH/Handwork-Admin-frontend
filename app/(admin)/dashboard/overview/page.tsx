import DashboardOverview from '@/modules/dashboard';
import { Metadata, NextPage } from 'next'

export const metadata: Metadata = {
  title: "Dashboard - HandworkExpert",
  description: "Welcome back, Admin. HandworkExpert overview and quick metrics.",
};

const Overview: NextPage = () => {
  return (
    <>
      <DashboardOverview />
    </>
  )
}

export default Overview