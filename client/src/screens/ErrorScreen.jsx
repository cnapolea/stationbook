const ErrorScreen = ({ error }) => {
  return (
    <div className='flex flex-col'>
      <h1>{error.statusCode}</h1>
      <h2>{error.message}</h2>
    </div>
  );
};
export default ErrorScreen;
