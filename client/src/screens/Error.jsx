import { SCREEN_STATES } from '../lib/constants';

const Error = ({ error, setters }) => {
  return (
    <div className='flex flex-col'>
      <h1>{error.statusCode}</h1>
      <h2>{error.message}</h2>
      {setters && (
        <button
          type='button'
          onClick={() => {
            setters.setError(null);
            setters.setState(SCREEN_STATES.LOADED);
          }}
        >
          Retry
        </button>
      )}
    </div>
  );
};
export default Error;
