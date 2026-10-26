import { notFound } from 'next/navigation';
import { siteMetadata } from '@/lib/site-metadata';
import LegalIndex from '@/modules/site/legal';

export const dynamicParams = false;

export function generateStaticParams() {
  return [
    { path: "policy"},
    { path: "terms"},
  ]
}

export async function generateMetadata({ params }: PageProps<'/[path]'>) {
  const { path } = await params;

  return siteMetadata({
    title: path === "policy"? "privacy policy": "terms and conditions",
    description: `HandworkExpert legal ${path} document`,
    path: `/${path}`,
  });
}

export default async function LegalPage({ params }: PageProps<'/[path]'>) {
  const { path } = await params;
  const vetPath = path === "policy"? "policy": "terms"
  if (!vetPath) notFound();

  return <LegalIndex id={vetPath} />
}
