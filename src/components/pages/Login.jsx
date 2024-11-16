/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../redux/api/authApiSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import {
  AuthContainer,
  Title,
  Input,
  EyeButton,
  ErrorMessage,
  AuthLink,
  Background,
  AuthForm,
  InputWrapper,
} from "../../ui/AuthUI";
import Button from "../reusable/Button";
import { Flex } from "../../ui/GlobalStyle";
import AuthIcon from "../auth/AuthIcon";
import { FaKey } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { MdGTranslate } from "react-icons/md";
const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) return "Email is required.";
    if (!emailRegex.test(email)) return "Please enter a valid email.";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailValidationError = validateEmail(credentials.email);
    const passwordValidationError = validatePassword(credentials.password);

    setEmailError(emailValidationError);
    setPasswordError(passwordValidationError);

    if (emailValidationError || passwordValidationError) {
      setError("");
      return;
    }

    try {
      await login(credentials).unwrap();
      navigate("/");
    } catch (err) {
      console.error("Failed to log in", err);
      setError("Failed to log in. Please check your credentials.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));

    if (name === "email") {
      setEmailError("");
    } else if (name === "password") {
      setPasswordError("");
    }
  };

  return (
    <Background>
      <AuthIcon />
      <AuthContainer width="500px">
        <Flex justifyContent="space-between">
          <MdGTranslate color="#0E99FF" size={50} />
          <Flex>
            <Title align={"left"}>Welcome to</Title>
            <Title color={"#0E99FF"} size={"40px"} align={"left"}>
              বাংলাস্ক্রাইব{" "}
            </Title>
          </Flex>
        </Flex>
        <AuthForm onSubmit={handleSubmit}>
          <InputWrapper>
            <Flex direction="column" alignItems="flex-start">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={credentials.email}
                onChange={handleInputChange}
              />
              <div
                style={{ position: "absolute", left: "5px", bottom: "33px" }}
              >
                <MdEmail size={18} />
              </div>
              <ErrorMessage show={!!emailError}>{emailError}</ErrorMessage>
            </Flex>
          </InputWrapper>
          {/* Password Field */}
          <InputWrapper>
            <Flex direction="column" alignItems="flex-start">
              <label htmlFor="password">Password</label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={handleInputChange}
              />
              <EyeButton onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </EyeButton>
              <div
                style={{ position: "absolute", left: "5px", bottom: "33px" }}
              >
                <FaKey size={18} />
              </div>
              <ErrorMessage show={!!passwordError}>
                {passwordError}
              </ErrorMessage>
            </Flex>
          </InputWrapper>
          {/* Submit Button */}
          <Flex>
            <Button
              size="md"
              variant="primary"
              disabled={isLoading}
              isLoading={isLoading}
            >
              Sign in
            </Button>
          </Flex>
          <ErrorMessage show={!!error}>{error}</ErrorMessage>

          <AuthLink to="/register">Don't have an account? Register</AuthLink>
        </AuthForm>
      </AuthContainer>
    </Background>
  );
};

export default Login;
