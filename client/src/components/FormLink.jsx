import { Link } from 'react-router-dom';

const FormLink = ({ url, className, linkTxt }) => {
  const defaultClassName = 'block';
  return (
    <Link to={url} className={className ? className : defaultClassName}>
      {linkTxt}
    </Link>
  );
};

export default FormLink;
