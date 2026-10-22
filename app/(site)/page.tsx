import HomeIndex from '@/modules/site/home';
import { siteMetadata } from '@/lib/site-metadata';

export const metadata = siteMetadata({
  title: "Book Trusted Artisans Near You",
  path: "/",
});

export default function Home() {
  return <HomeIndex />
}
