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

// interface NoteFormProps {
//   onCancel: () => void;
// }

const initialValues = {
  title: '',
  content: '',
  tag: 'Todo' as Tag,
};

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

function NoteForm({}) {
  const fieldId = useId();
  const queryClient = useQueryClient();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<CreateNote>>({});
  const handelCancel = () => router.push('/notes/filter/all');
  const { draft, setDraft, clearDraft } = useNoteDraftStore();
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setDraft({ ...draft, [e.target.name]: e.target.value });
  };

  const mutationAddNote = useMutation({
    mutationFn: async (values: CreateNote) => createNote(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft();
      router.push('/notes/filter/all');
    },
  });

  const handleSubmit = async (formData: FormData) => {
    const values = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      tag: formData.get('tag') as Tag,
    };
    try {
      await NoteFormValidation.validate(values, { abortEarly: false });
      setErrors({});
      await mutationAddNote.mutateAsync(values);
      setValues(initialValues);
      handelCancel();
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
            defaultValue={draft?.title}
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
            defaultValue={draft?.content}
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
            defaultValue={draft?.tag}
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
            onClick={handelCancel}
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

// import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from 'formik';
// import css from './NoteForm.module.css';
// import { useId } from 'react';
// import * as Yup from 'yup';
// import type { CreateNote, Tag } from '../../types/note';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { createNote } from '@/lib/api';
// import Loader from '../Loader/Loader';
// import ErrorMessageBox from '../ErrorMessageBox/ErrorMessageBox';

// interface NoteFormValue {
//   title: string;
//   content: string;
//   tag: Tag;
// }

// interface NoteFormProps {
//   onCancel: () => void;
// }

// const initialValues: NoteFormValue = {
//   title: '',
//   content: '',
//   tag: 'Todo',
// };

// function NoteForm({ onCancel }: NoteFormProps) {
//   const queryClient = useQueryClient();
//   const fieldId = useId();

//   const mutationAddNote = useMutation({
//     mutationFn: async (values: CreateNote) => createNote(values),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['notes'] });
//       onCancel();
//     },
//   });

//   const handleSubmit = async (
//     values: NoteFormValue,
//     actions: FormikHelpers<NoteFormValue>
//   ) => {
//     try {
//       await mutationAddNote.mutateAsync(values);
//       actions.resetForm();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const OrderFormSchema = Yup.object().shape({
//     title: Yup.string()
//       .required('Title is required')
//       .min(3, 'Title must be at least 3 characters')
//       .max(50, 'Too Long'),
//     content: Yup.string().max(500, 'Too Long'),
//     tag: Yup.string()
//       .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'], 'Invalid tag')
//       .required('Select a tag'),
//   });

//   return (
//     <>
//       {mutationAddNote.isPending && <Loader />}
//       {mutationAddNote.isError && <ErrorMessageBox />}

//       <Formik
//         initialValues={initialValues}
//         validationSchema={OrderFormSchema}
//         onSubmit={handleSubmit}
//       >
//         <Form className={css.form}>
//           <div className={css.formGroup}>
//             <label
//               className={css.label}
//               htmlFor={`${fieldId}-title`}
//             >
//               Title
//             </label>
//             <Field
//               id='title'
//               type='text'
//               name='title'
//               className={css.input}
//             />
//             <ErrorMessage
//               name='title'
//               component='span'
//               className={css.error}
//             />
//           </div>

//           <div className={css.formGroup}>
//             <label
//               className={css.label}
//               htmlFor={`${fieldId}-content`}
//             >
//               Content
//             </label>
//             <Field
//               as='textarea'
//               id='content'
//               name='content'
//               rows={8}
//               className={css.textarea}
//             />

//             <ErrorMessage
//               name='content'
//               component='span'
//               className={css.error}
//             />
//           </div>

//           <div className={css.formGroup}>
//             <label
//               className={css.label}
//               htmlFor='tag'
//             >
//               Tag
//             </label>
//             <Field
//               as='select'
//               id='tag'
//               name='tag'
//               className={css.select}
//             >
//               <option value='Todo'>Todo</option>
//               <option value='Work'>Work</option>
//               <option value='Personal'>Personal</option>
//               <option value='Meeting'>Meeting</option>
//               <option value='Shopping'>Shopping</option>
//             </Field>

//             <ErrorMessage
//               name='tag'
//               component='span'
//               className={css.error}
//             />
//           </div>

//           <div className={css.actions}>
//             <button
//               type='button'
//               className={css.cancelButton}
//               onClick={onCancel}
//             >
//               Cancel
//             </button>

//             <button
//               type='submit'
//               className={css.submitButton}
//             >
//               Create note
//             </button>
//           </div>
//         </Form>
//       </Formik>
//     </>
//   );
// }

// export default NoteForm;
