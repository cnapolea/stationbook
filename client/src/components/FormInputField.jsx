const handleInputChange = (event, setStateFn) => {
  setStateFn(event.target.value);
};

export const FormInputField = ({ type, placeholder, setStateFn }) => {
  return (
    <>
      <input
        type={type}
        placeholder={placeholder}
        onChange={(e) => handleInputChange(e, setStateFn)}
      />
    </>
  );
};
