/* eslint-disable react/prop-types */
import { useState } from "react";
import useColors from "../../hooks/useColors";
import styled from "styled-components";
import ReactModal from "react-modal";

const RegistrationModal = ({ isOpen, onRequestClose }) => {
  const colors = useColors();

  const [userDetails, setUserDetails] = useState({
    mobile_number: "",
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    address: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate the fields
    const validationErrors = validateFields();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      // Simulate form submission
      console.log("Form submitted", userDetails);
      setErrors({});
      // You can handle the submission here (API call, etc.)
    }
  };

  const validateFields = () => {
    const validationRules = {
      mobile_number: {
        required: true,
        message: "Mobile number is required.",
      },
      first_name: {
        required: true,
        message: "First name is required.",
      },
      last_name: {
        required: true,
        message: "Last name is required.",
      },
      address: {
        required: true,
        message: "Address is required.",
      },
      email: {
        required: true,
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        messages: {
          required: "Email is required.",
          invalid: "Please enter a valid email.",
        },
      },
      password: {
        required: true,
        minLength: 8,
        messages: {
          required: "Password is required.",
          tooShort: "Password must be at least 8 characters.",
        },
      },
      confirmPassword: {
        required: true,
        match: "password",
        messages: {
          required: "Confirm password is required.",
          mismatch: "Passwords do not match.",
        },
      },
    };

    const validationErrors = {};

    for (const [field, rules] of Object.entries(validationRules)) {
      const value = userDetails[field];

      if (rules.required && !value) {
        validationErrors[field] = rules.message || rules.messages.required;
      } else if (rules.pattern && value && !rules.pattern.test(value)) {
        validationErrors[field] = rules.messages.invalid;
      } else if (rules.minLength && value && value.length < rules.minLength) {
        validationErrors[field] = rules.messages.tooShort;
      } else if (rules.match && value && value !== userDetails[rules.match]) {
        validationErrors[field] = rules.messages.mismatch;
      }
    }

    return validationErrors;
  };

  return (
    <ReactModal
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          margin: "auto",
          zIndex: 999,
        },
        content: {
          borderRadius: "10px",
          height: "fit-content",
          maxHeight: "95vh",
          maxWidth: "800px",
          margin: "auto",
          border: "none",
          padding: "0",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          zIndex: 999,
        },
      }}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      ariaHideApp={false}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
    >
      <Header colors={colors}>
        <h3>User Registration</h3>
        <CloseButton onClick={onRequestClose} colors={colors}>
          ×
        </CloseButton>
      </Header>
      <FormContainer colors={colors}>
        <form onSubmit={handleSubmit}>
          <InputRow>
            <Input
              colors={colors}
              type="text"
              name="first_name"
              placeholder="First Name"
              value={userDetails.first_name}
              onChange={handleChange}
            />
            {errors.first_name && <Error>{errors.first_name}</Error>}

            <Input
              colors={colors}
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={userDetails.last_name}
              onChange={handleChange}
            />
            {errors.last_name && <Error>{errors.last_name}</Error>}
          </InputRow>

          <Input
            colors={colors}
            type="text"
            name="mobile_number"
            placeholder="Mobile Number"
            value={userDetails.mobile_number}
            onChange={handleChange}
          />
          {errors.mobile_number && <Error>{errors.mobile_number}</Error>}

          <Input
            colors={colors}
            type="email"
            name="email"
            placeholder="Email"
            value={userDetails.email}
            onChange={handleChange}
          />
          {errors.email && <Error>{errors.email}</Error>}

          <Input
            colors={colors}
            type="password"
            name="password"
            placeholder="Password"
            value={userDetails.password}
            onChange={handleChange}
          />
          {errors.password && <Error>{errors.password}</Error>}

          <Input
            colors={colors}
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={userDetails.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && <Error>{errors.confirmPassword}</Error>}

          <Input
            colors={colors}
            type="text"
            name="address"
            placeholder="Address"
            value={userDetails.address}
            onChange={handleChange}
          />
          {errors.address && <Error>{errors.address}</Error>}

          <ButtonContainer>
            <Button colors={colors} type="submit">
              Submit
            </Button>
            <CancelButton onClick={onRequestClose} colors={colors}>
              Cancel
            </CancelButton>
          </ButtonContainer>
        </form>
      </FormContainer>
    </ReactModal>
  );
};

export default RegistrationModal;

const FormContainer = styled.div`
  flex: 1;
  padding: 20px;
  background-color: ${({ colors }) => colors?.light};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ colors }) => colors?.primary};

  padding: 15px;
  border-radius: 8px 8px 0 0;

  h3 {
    color: ${({ colors }) => colors?.text};
    margin: 0;
  }
`;

const CloseButton = styled.button`
  background-color: ${({ colors }) => colors?.danger};
  font-size: 20px;
  padding: 5px 10px;
  border-radius: 5px;
  border: none;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid ${({ colors }) => colors?.border};
  background-color: ${({ colors }) => colors?.background};
  color: ${({ colors }) => colors?.text};

  &:focus {
    border-color: ${({ colors }) => colors?.primary};
    outline: none;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 12px;
  background-color: ${({ colors }) => colors?.primary};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: ${({ colors }) => colors?.secondary};
  }
`;

const CancelButton = styled.button`
  padding: 12px;
  background-color: ${({ colors }) => colors?.danger};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: ${({ colors }) => colors?.dangerDark};
  }
`;

const InputRow = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 10px;

  & > input {
    flex: 1;
  }
`;

const Error = styled.div`
  color: red;
  font-size: 12px;
  margin-top: 5px;
`;
