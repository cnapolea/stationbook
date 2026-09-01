import { AUTH_TYPE, CLIENT_ROUTES } from '../lib/constants';
import { FormInputField } from './FormInputField';
import FormLink from './FormLink';
import { FormSubmitBtn } from './FormSubmitBtn';

const AuthForm = ({ authType, inputFields, onSubmitHandler }) => {
  return (
    <form onSubmit={onSubmitHandler}>
      <div>
        {Object.entries(inputFields).map(([key, value]) => (
          <FormInputField
            key={key}
            type={value.properties.type}
            placeholder={value.properties.placeholder}
            setStateFn={value.setValue}
            currentValue={value.properties.value}
            error={value.properties.error}
          />
        ))}
      </div>
      <FormSubmitBtn btnText='Submit' />
      <FormLink
        url={
          authType === AUTH_TYPE.REGISTER
            ? CLIENT_ROUTES.LOGIN
            : CLIENT_ROUTES.REGISTER
        }
        linkTxt={
          authType === AUTH_TYPE.REGISTER
            ? 'Already Registered? Try to login.'
            : 'New Here? Try to register first.'
        }
      />
    </form>
  );
};
export default AuthForm;
