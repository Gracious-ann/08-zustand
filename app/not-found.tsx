import css from './home.module.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found | Note App',
  description: 'Сторінка не знайдена. Такої сторінки не існує U+0443 Note App.',
  openGraph: {
    title: 'Page Not Found | Note App',
    description:
      'Сторінка не знайдена. Такої сторінки не існує U+0443 Note App.',
    url: 'https://note-app.example.com/not-found',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'Page Not Found',
      },
    ],
  },
};

function NotFound() {
  return (
    <>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </>
  );
}

export default NotFound;
