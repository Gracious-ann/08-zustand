import axios from 'axios';
import type { CreateNote, Note } from '../types/note';

interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

export async function fetchNotes(
  title: string,
  page: number,
  category?: string
): Promise<NotesResponse> {
  const response = await axios.get<NotesResponse>(
    'https://notehub-public.goit.study/api/notes',
    {
      params: {
        search: title,
        page,
        perPage: 12,
        tag: category,
      },
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
      },
    }
  );
  return response.data;
}

export async function createNote({
  title,
  content,
  tag,
}: CreateNote): Promise<Note> {
  const addNote = await axios.post<Note>(
    'https://notehub-public.goit.study/api/notes',

    {
      title,
      content,
      tag,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
      },
    }
  );
  return addNote.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const deleteNote = await axios.delete<Note>(
    `https://notehub-public.goit.study/api/notes/${id}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
      },
    }
  );
  return deleteNote.data;
}

export const fetchNoteById = async (id: string) => {
  const noteById = await axios.get<Note>(
    `https://notehub-public.goit.study/api/notes/${id}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
      },
    }
  );
  return noteById.data;
};

// export async function getCategories(tag?: string): Promise<NotesResponse> {
//   const response = await axios.get<NotesResponse>(
//     'https://notehub-public.goit.study/api/notes',
//     {
//       params: {
//         tag: tag,
//       },
//       headers: {
//         Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
//       },
//     }
//   );
//   return response.data;
// }
