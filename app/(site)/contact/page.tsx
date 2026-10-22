import ContactIndex from '@/modules/site/contact';
import { siteMetadata } from '@/lib/site-metadata';

export const metadata = siteMetadata({
  title: "Contact Us",
  description: "Get in touch with the Handwork Expert support team. We're here to help with questions, feedback, or anything about your bookings and artisan services.",
  path: "/contact",
});

export default function Contact() {
  return <ContactIndex />
}
