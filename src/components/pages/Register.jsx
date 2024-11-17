import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../redux/api/authApiSlice";
import PhoneInput from "react-phone-input-2";
import {
  AuthContainer,
  Title,
  InputWrapper,
  Input,
  ErrorMessage,
  AuthLink,
  Background,
  AuthForm,
} from "../../ui/AuthUI";
import { Flex } from "../../ui/GlobalStyle";
import Button from "../reusable/Button";
import AuthIcon from "../auth/AuthIcon";
import { MdGTranslate } from "react-icons/md";
import { FaPenNib } from "react-icons/fa";
import { FaKey } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaAddressBook } from "react-icons/fa";
const Register = () => {
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
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateFields();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await register(userDetails).unwrap();
      navigate("/login");
    } catch (err) {
      console.error("Failed to register", err);
      setErrors({ global: "Failed to register. Please try again." });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));

    // Clear specific field errors when the user types
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handlePhoneChange = (value) => {
    setUserDetails({ ...userDetails, mobile_number: value });
  };
  return (
    <Background>
      <AuthIcon width="60%" height="60%" />
      <AuthContainer>
        <Flex justifyContent="space-between" margin="50px 0px 0px 0px">
          <MdGTranslate color="#0E99FF" size={50} />
          <Flex>
            <Title align={"left"}>Create an Account on</Title>
            <Title color={"#0E99FF"} size={"40px"} align={"left"}>
              বাংলাস্ক্রাইব{" "}
            </Title>
          </Flex>
        </Flex>
        <AuthForm onSubmit={handleSubmit}>
          <InputWrapper>
            <Flex direction="column" alignItems="flex-start">
              <label>
                First Name <span style={{ color: "red" }}>*</span>
              </label>
              <Input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={userDetails.first_name}
                onChange={handleInputChange}
              />
              <div
                style={{ position: "absolute", left: "5px", bottom: "33px" }}
              >
                <FaPenNib size={18} />
              </div>
              <ErrorMessage show={!!errors.first_name}>
                {errors.first_name}
              </ErrorMessage>
            </Flex>

            <Flex direction="column" alignItems="flex-start">
              <label>
                Last Name <span style={{ color: "red" }}>*</span>
              </label>
              <Input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={userDetails.last_name}
                onChange={handleInputChange}
              />
              <div
                style={{ position: "absolute", left: "5px", bottom: "33px" }}
              >
                <FaPenNib size={18} />
              </div>
              <ErrorMessage show={!!errors.last_name}>
                {errors.last_name}
              </ErrorMessage>
            </Flex>
          </InputWrapper>
          <InputWrapper>
            <Flex direction="column" alignItems="flex-start">
              <label>
                Email <span style={{ color: "red" }}>*</span>
              </label>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={userDetails.email}
                onChange={handleInputChange}
              />
              <div
                style={{ position: "absolute", left: "5px", bottom: "33px" }}
              >
                <MdEmail size={18} />
              </div>
              <ErrorMessage show={!!errors.email}>{errors.email}</ErrorMessage>
            </Flex>
            <Flex direction="column" alignItems="flex-start">
              <label>
                Mobile Number <span style={{ color: "red" }}>*</span>
              </label>
              <PhoneInput
                country={"bd"} // Default country
                value={userDetails.mobile_number}
                onChange={handlePhoneChange}
                inputProps={{
                  name: "mobile_number",
                  required: true,
                  autoFocus: true,
                }}
              />
              <ErrorMessage show={!!errors.mobile_number}>
                {errors.mobile_number}
              </ErrorMessage>
            </Flex>
          </InputWrapper>

          <InputWrapper>
            <Flex direction="column" alignItems="flex-start">
              <label>
                Password <span style={{ color: "red" }}>*</span>
              </label>
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={userDetails.password}
                onChange={handleInputChange}
              />
              <div
                style={{ position: "absolute", left: "5px", bottom: "33px" }}
              >
                <FaKey size={18} />
              </div>
              <ErrorMessage show={!!errors.password}>
                {errors.password}
              </ErrorMessage>
            </Flex>

            <Flex direction="column" alignItems="flex-start">
              <label>
                Confirm Password <span style={{ color: "red" }}>*</span>
              </label>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={userDetails.confirmPassword}
                onChange={handleInputChange}
              />
              <div
                style={{ position: "absolute", left: "5px", bottom: "33px" }}
              >
                <FaKey size={18} />
              </div>
              <ErrorMessage show={!!errors.confirmPassword}>
                {errors.confirmPassword}
              </ErrorMessage>
            </Flex>
          </InputWrapper>

          <InputWrapper>
            <Flex direction="column" alignItems="flex-start">
              <label>
                Address <span style={{ color: "red" }}>*</span>
              </label>
              <Input
                type="text"
                name="address"
                placeholder="Address"
                value={userDetails.address}
                onChange={handleInputChange}
              />
              <div
                style={{ position: "absolute", left: "5px", bottom: "33px" }}
              >
                <FaAddressBook size={18} />
              </div>
              <ErrorMessage show={!!errors.address}>
                {errors.address}
              </ErrorMessage>
            </Flex>
          </InputWrapper>

          <Flex>
            <Button
              size="md"
              variant="primary"
              disabled={isLoading}
              isLoading={isLoading}
            >
              Register
            </Button>
          </Flex>
          <ErrorMessage show={!!errors.global}>{errors.global}</ErrorMessage>
          <AuthLink to="/login">Already have an account? Login</AuthLink>
        </AuthForm>
      </AuthContainer>
    </Background>
  );
};

export default Register;
