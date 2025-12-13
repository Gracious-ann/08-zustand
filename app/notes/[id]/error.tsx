'use client';

type PropsError = {
  error: Error;
  reset: () => void;
};

export default function Error({ error, reset }: PropsError) {
  return (
    <>
      <p>Could not fetch note details. {error.message}</p>
      {error.message}
      <button onClick={reset}>Try again</button>
    </>
  );
}
