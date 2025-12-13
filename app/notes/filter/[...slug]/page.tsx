import { fetchNotes } from '@/lib/api';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import NotesClient from './Notes.client';
import { Tag } from '@/types/note';

type Props = {
  params: Promise<{ slug: string[] }>;
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
