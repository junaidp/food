import { Link } from 'react-router-dom';

const LINK = /(\[[^\]]+\]\([^)\s]+\))/g;

// Renders text with [label](/path) links; internal paths use client-side navigation.
export default function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(LINK).map((part, i) => {
        const m = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
        if (!m) return part;
        const [, label, href] = m;
        return href.startsWith('/') ? (
          <Link key={i} to={href} className="text-primary-700 font-medium underline underline-offset-2 hover:text-primary-800">
            {label}
          </Link>
        ) : (
          <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="text-primary-700 font-medium underline underline-offset-2">
            {label}
          </a>
        );
      })}
    </>
  );
}
