export const FormSubmitBtn = ({ type, btnText, onSubmitHandler }) => {
  return (
    <button
      type={type}
      onClick={onSubmitHandler}
      className='w-5 h-5 text-white-500'
    >
      {btnText}
    </button>
  );
};
