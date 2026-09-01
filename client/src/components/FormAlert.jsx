const FormAlert = ({ type, messages }) => {
  const classNameType = {
    danger:
      'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative',
    warning:
      'bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded relative',
    success:
      'bg-teal-100 border border-teal-400 text-teal-700 px-4 py-3 rounded relative',
  };

  return (
    <ul className={classNameType[type]} role='alert'>
      {messages?.map((message, i) => (
        <li key={i} className='block sm:inline'>
          {message}
        </li>
      ))}
    </ul>
  );
};

export default FormAlert;
