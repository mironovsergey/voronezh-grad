'use client';

const Error = ({ error, reset }: { error: Error; reset: () => void }) => {
  return (
    <div>
      <h1>Ошибка: {error.message}</h1>
      <button onClick={reset}>Попробовать снова</button>
    </div>
  );
};

export default Error;
