import AboutUsIndex from '@/modules/site/about-us';
import { siteMetadata } from '@/lib/site-metadata';

export const metadata = siteMetadata({
  title: "About Us",
  description: "Learn about Handwork Expert — our mission to connect users with trusted, verified artisans across Nigeria for reliable, professional home and business services.",
  path: "/about-us",
});

export default function AboutUs() {
  return <AboutUsIndex />
}
