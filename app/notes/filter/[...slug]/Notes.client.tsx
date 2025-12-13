'use client';
import NoteForm from '@/components/NoteForm/NoteForm';
import css from './page.module.css';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import { fetchNotes } from '@/lib/api';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import { useDebouncedCallback } from 'use-debounce';
import ErrorMessageBox from '@/components/ErrorMessageBox/ErrorMessageBox';
import Loader from '@/components/Loader/Loader';
import { Tag } from '@/types/note';

interface NotesClientProps {
  tag?: Tag;
}

const NotesClient = ({ tag }: NotesClientProps) => {
  const [inputValue, setInputValue] = useState('');
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const {
    data: notes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['notes', currentPage, searchText, tag],
    queryFn: () => fetchNotes(searchText, currentPage, tag),
    refetchOnMount: false,
    enabled: true,
    placeholderData: keepPreviousData,
  });

  const totalPages = notes?.totalPages ?? 0;

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const debouncedSearch = useDebouncedCallback((text: string) => {
    setSearchText(text);
    setCurrentPage(1);
  }, 1000);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <button
          onClick={openModal}
          className={css.button}
        >
          Create note +
        </button>
        {
          <SearchBox
            value={inputValue}
            onSearch={value => {
              setInputValue(value);
              debouncedSearch(value);
            }}
          />
        }
        {isError && <ErrorMessageBox />}
        {isLoading && <Loader />}
        {totalPages > 1 && (
          <Pagination
            totalPage={totalPages}
            onPageChange={setCurrentPage}
            currentPage={currentPage}
          />
        )}
        {isModalOpen && (
          <Modal onCancel={closeModal}>
            <NoteForm onCancel={closeModal} />
          </Modal>
        )}
      </header>
      {notes && notes.notes?.length > 0 && <NoteList notes={notes.notes} />}
    </div>
  );
};

export default NotesClient;
