import { fetchNotes } from '@/lib/api';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import NotesClient from './Notes.client';
import { Tag } from '@/types/note';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string[] }>;
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { slug } = await params;
  const tag = slug?.[0] === 'all' ? undefined : (slug?.[0] as Tag);
  return {
    title: `Note: ${tag}`,
    description: `Перегляд нотаток з фільтром: ${tag}`,
    openGraph: {
      title: `Note App — Фільтр: ${tag}`,
      description: `Перегляд нотаток з фільтром: ${tag}`,
      url: `https://08-zustand-virid-five.vercel.app/${tag}`,
      siteName: 'NoteHub',
      images: [
        {
          url: 'https://placehold.co/1200x630',
          width: 1200,
          height: 630,
          alt: `Note App — Фільтр: ${tag}`,
        },
      ],
      type: 'article',
    },
  };
};
const NotesByCategory = async ({ params }: Props) => {
  const queryClient = new QueryClient();
  const { slug } = await params;
  const tag = slug?.[0] === 'all' ? undefined : (slug?.[0] as Tag);

  const currentPage = 1;
  const searchText = '';

  await queryClient.prefetchQuery({
    queryKey: ['notes', currentPage, searchText, tag],
    queryFn: () => fetchNotes(searchText, currentPage, tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
};

export default NotesByCategory;
