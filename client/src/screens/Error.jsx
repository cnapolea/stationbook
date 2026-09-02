const Error = ({ error }) => {
  return (
    <>
      <h1>{error.statusCode}</h1>
      <h2>{error.Message}</h2>
    </>
  );
};
export default Error;
