import { notFound } from 'next/navigation';
import { CategoryDetailsIndex } from '@/modules/site/categories-details';
import { CATEGORY_DETAILS, CATEGORY_LINKS } from '@/modules/site/categories-details/data';
import { siteMetadata } from '@/lib/site-metadata';

// only the known category slugs exist; anything else is a 404
export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORY_LINKS.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: PageProps<'/categories/[id]'>) {
  const { id } = await params;
  const category = CATEGORY_DETAILS[id]?.category;

  return siteMetadata({
    title: category ? `${category} Artisans` : "Find Artisans",
    description: `Browse and book verified ${category || "service"} artisans on Handwork Expert. Compare profiles, ratings, and prices to find the best professional near you.`,
    path: `/categories/${id}`,
  });
}

export default async function CategoryDetails({ params }: PageProps<'/categories/[id]'>) {
  const { id } = await params;
  const details = CATEGORY_DETAILS[id];
  if (!details) notFound();

  return <CategoryDetailsIndex id={id} details={details} />
}
