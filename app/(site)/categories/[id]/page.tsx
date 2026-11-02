import { notFound } from 'next/navigation';
import { CategoryDetailsIndex } from '@/modules/site/categories-details';
import { CATEGORY_LINKS, categoryName } from '@/modules/site/categories-details/data';
import { siteMetadata } from '@/lib/site-metadata';

// only the known category slugs exist; anything else is a 404
export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORY_LINKS.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: PageProps<'/categories/[id]'>) {
  const { id } = await params;
  const category = categoryName(id);

  return siteMetadata({
    title: category ? `${category} Artisans` : "Find Artisans",
    description: `Browse and book verified ${category || "service"} artisans on Handwork Expert. Compare profiles, services and prices to find the right professional near you.`,
    path: `/categories/${id}`,
  });
}

export default async function CategoryDetails({ params }: PageProps<'/categories/[id]'>) {
  const { id } = await params;
  const category = categoryName(id);
  if (!category) notFound();

  return <CategoryDetailsIndex id={id} category={category} />
}
