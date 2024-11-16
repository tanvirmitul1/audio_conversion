/* eslint-disable react/prop-types */

import { Field, ErrorMessage } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { InputWrapper, EyeButton, ErrorMessageStyled } from "../../ui/AuthUI";

const InputField = ({
  name,
  type,
  placeholder,
  showPassword,
  setShowPassword,
}) => {
  return (
    <InputWrapper>
      <Field
        name={name}
        type={type === "password" && showPassword ? "text" : type}
        placeholder={placeholder}
      />
      {type === "password" && (
        <EyeButton onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </EyeButton>
      )}
      <ErrorMessage name={name} component={ErrorMessageStyled} />
    </InputWrapper>
  );
};

export default InputField;
