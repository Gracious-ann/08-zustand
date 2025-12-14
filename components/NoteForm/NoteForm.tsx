'use client';

import { useId, useState } from 'react';
import * as Yup from 'yup';
import css from './NoteForm.module.css';
import type { Tag, CreateNote } from '../../types/note';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api';
import Loader from '../Loader/Loader';
import ErrorMessageBox from '../ErrorMessageBox/ErrorMessageBox';
import { useNoteDraftStore } from '@/lib/store/noteStore';
import { useRouter } from 'next/navigation';

const NoteFormValidation = Yup.object({
  title: Yup.string()
    .min(3, 'Title must have minimum 3 symbols')
    .max(50, 'Title must have maximum 50 symbols')
    .required('Title is required'),
  content: Yup.string().max(500, 'Content must have maximum 500 symbols'),
  tag: Yup.string()
    .oneOf(
      ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'],
      'Wrong tag name'
    )
    .required('Tag is required'),
});

function NoteForm() {
  const fieldId = useId();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { draft, setDraft, clearDraft } = useNoteDraftStore();
  const [errors, setErrors] = useState<Partial<CreateNote>>({});

  const mutationAddNote = useMutation({
    mutationFn: (values: CreateNote) => createNote(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft();
      router.push('/notes/filter/all');
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setDraft({ ...draft, [name]: value });
  };

  const handleSubmit = async (formData: FormData) => {
    const values: CreateNote = {
      title: (formData.get('title') ?? '') as string,
      content: (formData.get('content') ?? '') as string,
      tag: (formData.get('tag') ?? 'Todo') as Tag,
    };

    try {
      await NoteFormValidation.validate(values, { abortEarly: false });
      setErrors({});
      await mutationAddNote.mutateAsync(values);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const newErrors = Object.fromEntries(
          err.inner.map(error => [error.path, error.message])
        );
        setErrors(newErrors);
      }
    }
  };

  return (
    <>
      {mutationAddNote.isPending && <Loader />}
      {mutationAddNote.isError && <ErrorMessageBox />}

      <form
        className={css.form}
        action={handleSubmit}
      >
        <div className={css.formGroup}>
          <label
            className={css.label}
            htmlFor={`${fieldId}-title`}
          >
            Title
          </label>
          <input
            id={`${fieldId}-title`}
            name='title'
            type='text'
            value={draft.title}
            onChange={handleChange}
            className={css.input}
          />
          {errors.title && <span className={css.error}>{errors.title}</span>}
        </div>

        <div className={css.formGroup}>
          <label
            className={css.label}
            htmlFor={`${fieldId}-content`}
          >
            Content
          </label>
          <textarea
            id={`${fieldId}-content`}
            name='content'
            rows={8}
            value={draft.content}
            onChange={handleChange}
            className={css.textarea}
          />
          {errors.content && (
            <span className={css.error}>{errors.content}</span>
          )}
        </div>

        <div className={css.formGroup}>
          <label
            className={css.label}
            htmlFor={`${fieldId}-tag`}
          >
            Tag
          </label>
          <select
            id={`${fieldId}-tag`}
            name='tag'
            value={draft.tag}
            onChange={handleChange}
            className={css.select}
          >
            <option value='Todo'>Todo</option>
            <option value='Work'>Work</option>
            <option value='Personal'>Personal</option>
            <option value='Meeting'>Meeting</option>
            <option value='Shopping'>Shopping</option>
          </select>
          {errors.tag && <span className={css.error}>{errors.tag}</span>}
        </div>

        <div className={css.actions}>
          <button
            type='button'
            className={css.cancelButton}
            onClick={() => router.push('/notes/filter/all')}
          >
            Cancel
          </button>
          <button
            type='submit'
            className={css.submitButton}
          >
            Create note
          </button>
        </div>
      </form>
    </>
  );
}

export default NoteForm;
