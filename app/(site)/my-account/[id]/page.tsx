import { notFound } from 'next/navigation';
import { siteMetadata } from '@/lib/site-metadata';
import AccountManagement from '@/modules/site/my-account';

export const dynamicParams = false;

export function generateStaticParams() {
  return [
    { path: "user"},
    { path: "artisan"},
  ]
}

export async function generateMetadata({ params }: PageProps<'/my-account/[id]'>) {
  const { id } = await params;

  return siteMetadata({
    title: id,
    description: `My HandworkExpert ${id} account management`,
    path: `/my-account/${id}`,
  });
}

export default async function AccountDetails({ params }: PageProps<'/my-account/[id]'>) {
  const { id } = await params;
  const vetId = id === "user"? "user": "artisan"
  if (!vetId) notFound();

  return <AccountManagement id={vetId} />
}
