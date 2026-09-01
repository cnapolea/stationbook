const handleInputChange = (event, setStateFn) => {
  setStateFn((cv) => ({ ...cv, value: event.target.value }));
};

export const FormInputField = ({
  type,
  placeholder,
  setStateFn,
  currentValue,
  error,
}) => {
  return (
    <>
      <input
        type={type}
        placeholder={`Enter ${placeholder}`}
        onChange={(e) => handleInputChange(e, setStateFn)}
        value={currentValue}
      />
      {error && <span>{error.message}</span>}
    </>
  );
};
