import FAQIndex from '@/modules/site/faq';
import { siteMetadata } from '@/lib/site-metadata';

export const metadata = siteMetadata({
  title: "Frequently Asked Questions",
  description: "Find answers to the most common questions about Handwork Expert — how to book artisans, payment methods, verification, and more.",
  path: "/faq",
});

export default function FAQ() {
  return <FAQIndex />
}
