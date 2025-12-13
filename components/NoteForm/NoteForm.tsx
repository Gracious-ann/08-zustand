import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from 'formik';
import css from './NoteForm.module.css';
import { useId } from 'react';
import * as Yup from 'yup';
import type { CreateNote, Tag } from '../../types/note';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api';
import Loader from '../Loader/Loader';
import ErrorMessageBox from '../ErrorMessageBox/ErrorMessageBox';

interface NoteFormValue {
  title: string;
  content: string;
  tag: Tag;
}

interface NoteFormProps {
  onCancel: () => void;
}

const initialValues: NoteFormValue = {
  title: '',
  content: '',
  tag: 'Todo',
};

function NoteForm({ onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();
  const fieldId = useId();

  const mutationAddNote = useMutation({
    mutationFn: async (values: CreateNote) => createNote(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onCancel();
    },
  });

  const handleSubmit = async (
    values: NoteFormValue,
    actions: FormikHelpers<NoteFormValue>
  ) => {
    try {
      await mutationAddNote.mutateAsync(values);
      actions.resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  const OrderFormSchema = Yup.object().shape({
    title: Yup.string()
      .required('Title is required')
      .min(3, 'Title must be at least 3 characters')
      .max(50, 'Too Long'),
    content: Yup.string().max(500, 'Too Long'),
    tag: Yup.string()
      .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'], 'Invalid tag')
      .required('Select a tag'),
  });

  return (
    <>
      {mutationAddNote.isPending && <Loader />}
      {mutationAddNote.isError && <ErrorMessageBox />}

      <Formik
        initialValues={initialValues}
        validationSchema={OrderFormSchema}
        onSubmit={handleSubmit}
      >
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label
              className={css.label}
              htmlFor={`${fieldId}-title`}
            >
              Title
            </label>
            <Field
              id='title'
              type='text'
              name='title'
              className={css.input}
            />
            <ErrorMessage
              name='title'
              component='span'
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label
              className={css.label}
              htmlFor={`${fieldId}-content`}
            >
              Content
            </label>
            <Field
              as='textarea'
              id='content'
              name='content'
              rows={8}
              className={css.textarea}
            />

            <ErrorMessage
              name='content'
              component='span'
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label
              className={css.label}
              htmlFor='tag'
            >
              Tag
            </label>
            <Field
              as='select'
              id='tag'
              name='tag'
              className={css.select}
            >
              <option value='Todo'>Todo</option>
              <option value='Work'>Work</option>
              <option value='Personal'>Personal</option>
              <option value='Meeting'>Meeting</option>
              <option value='Shopping'>Shopping</option>
            </Field>

            <ErrorMessage
              name='tag'
              component='span'
              className={css.error}
            />
          </div>

          <div className={css.actions}>
            <button
              type='button'
              className={css.cancelButton}
              onClick={onCancel}
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
        </Form>
      </Formik>
    </>
  );
}

export default NoteForm;
