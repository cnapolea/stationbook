import { CLIENT_ROUTES } from '../lib/constants';
import { FormInputField } from './FormInputField';
import FormLink from './FormLink';
import { FormSubmitBtn } from './FormSubmitBtn';

const LoginForm = ({ setEmailFn, setPasswordFn, handleSubmitBtnFn }) => {
  return (
    <form onSubmit={handleSubmitBtnFn}>
      <div>
        <FormInputField
          type='email'
          placeholder='Enter Email'
          setStateFn={setEmailFn}
        />
        <FormInputField
          type='password'
          placeholder='Enter Password'
          setStateFn={setPasswordFn}
        />
      </div>
      <FormSubmitBtn type='submit' btnText='Submit' />
      <FormLink
        url={CLIENT_ROUTES.REGISTER}
        linkTxt={'New Here? Try to register first.'}
      />
    </form>
  );
};
export default LoginForm;
