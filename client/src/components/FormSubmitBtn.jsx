export const FormSubmitBtn = ({ type, btnText, onSubmitHandler }) => {
  return (
    <button
      type={type}
      onClick={onSubmitHandler}
      className='text-white-500 border cursor-pointer'
    >
      {btnText}
    </button>
  );
};
