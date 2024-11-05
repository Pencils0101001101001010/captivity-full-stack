// StatusMessage.tsx
interface StatusMessageProps {
  success?: string;
  error?: string;
}

export const StatusMessage = ({ success, error }: StatusMessageProps) => {
  if (!success && !error) return null;

  return (
    <>
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
          {error}
        </div>
      )}
    </>
  );
};
