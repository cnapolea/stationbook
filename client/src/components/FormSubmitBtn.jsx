export const FormSubmitBtn = ({ btnText, onSubmitHandler }) => {
  return (
    <button
      type='submit'
      onClick={onSubmitHandler}
      className='text-white-500 border cursor-pointer'
    >
      {btnText}
    </button>
  );
};
