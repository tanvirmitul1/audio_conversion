/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import styled from "styled-components";
import useColors from "../../hooks/useColors";

const Setting = () => {
  const colors = useColors();
  return (
    <Container colors={colors}>
      <Content>
        <UserRegistrationForm colors={colors} />
        <UserList colors={colors} />
      </Content>
    </Container>
  );
};

export default Setting;

const UserRegistrationForm = () => {
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
    <FormContainer colors={colors}>
      <h3>User Registration</h3>
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

        <Button colors={colors} type="submit">
          Register
        </Button>
      </form>
    </FormContainer>
  );
};

// User List Component
const UserList = ({ colors }) => {
  const [users, setUsers] = useState([
    { username: "John Doe", email: "john@example.com", role: "Admin" },
    { username: "Jane Smith", email: "jane@example.com", role: "User" },
  ]);

  return (
    <ListContainer colors={colors}>
      <h3>User List</h3>
      {users.length === 0 ? (
        <p>No users registered yet.</p>
      ) : (
        <ul>
          {users.map((user, index) => (
            <ListItem key={index} colors={colors}>
              <span>{user.username}</span>
              <span>{user.email}</span>
              <span>{user.role}</span>
            </ListItem>
          ))}
        </ul>
      )}
    </ListContainer>
  );
};

// Styled Components

const Container = styled.div`
  padding: 20px;
  background-color: ${({ colors }) => colors.background};
  color: ${({ colors }) => colors.text};
`;

const Content = styled.div`
  display: flex;
  gap: 30px;
`;

const FormContainer = styled.div`
  flex: 1;
  padding: 20px;
  background-color: ${({ colors }) => colors.light};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  h3 {
    color: ${({ colors }) => colors.primary};
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid ${({ colors }) => colors.border};
  background-color: ${({ colors }) => colors.background};
  color: ${({ colors }) => colors.text};

  &:focus {
    border-color: ${({ colors }) => colors.primary};
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: ${({ colors }) => colors.primary};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: ${({ colors }) => colors.secondary};
  }
`;

const ListContainer = styled.div`
  flex: 1;
  padding: 20px;
  background-color: ${({ colors }) => colors.light};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  h3 {
    color: ${({ colors }) => colors.primary};
  }

  ul {
    list-style-type: none;
    padding: 0;
  }
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 12px;
  border: 1px solid ${({ colors }) => colors.border};
  border-radius: 5px;
  margin-bottom: 10px;
  background-color: ${({ colors }) => colors.background};

  span {
    color: ${({ colors }) => colors.text};
  }
`;

// New styled component for the two input fields
const InputRow = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 10px;

  /* Ensure the input fields take up equal space */
  & > input {
    flex: 1;
  }
`;
const Error = styled.div`
  color: red;
  font-size: 12px;
  margin-top: 5px;
`;
