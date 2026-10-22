import { ForegroundCategories } from '@/modules/site/categories/foreground';
import { CategoriesContent } from '@/modules/site/categories/content';
import { siteMetadata } from '@/lib/site-metadata';

export const metadata = siteMetadata({
  title: "Browse Service Categories",
  description: "Explore all service categories on Handwork Expert — from plumbing and electrical to carpentry, painting, and more. Find the right artisan for any job.",
  path: "/categories",
});

export default function Categories() {
  return (
    <>
      <ForegroundCategories />
      <CategoriesContent />
    </>
  )
}
