import { CreateNote, Tag } from '@/types/note';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type NewNoteDraft = {
  draft: CreateNote;
  setDraft: (note: CreateNote) => void;
  clearDraft: () => void;
};

const initialDraft: CreateNote = {
  title: '',
  content: '',
  tag: 'Todo' as Tag,
};

export const useNoteDraftStore = create<NewNoteDraft>()(
  persist(
    set => ({
      draft: initialDraft,
      setDraft: note => set(() => ({ draft: note })),
      clearDraft: () => set(() => ({ draft: initialDraft })),
    }),
    {
      name: 'note-draft',
      partialize: state => ({ draft: state.draft }),
    }
  )
);
