const FormAlert = ({ type, message }) => {
  const classNameType = {
    danger:
      'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative',
    warning:
      'bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded relative',
    success:
      'bg-teal-100 border border-teal-400 text-teal-700 px-4 py-3 rounded relative',
  };

  return (
    <div class={classNameType[type]} role='alert'>
      <span class='block sm:inline'>{message}</span>
    </div>
  );
};

export default FormAlert;
