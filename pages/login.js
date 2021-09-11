import Head from "next/head";
import {
  Button,
  Divider,
  Form,
  Grid,
  Segment,
  Dimmer,
  Loader,
  Step,
  Icon,
  Message,
} from "semantic-ui-react";
import styles from "../styles/Home.module.css";
import "semantic-ui-css/semantic.min.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const [signupOpen, setsignupOpen] = useState(false);
  const [signupErrorMessage, setsignupErrorMessage] = useState("");
  const [loginErrorMessage, setloginErrorMessage] = useState("");
  const [otpErrorMessage, setotpErrorMessage] = useState("");
  const [signupSuccessMessage, setsignupSuccessMessage] = useState("");
  const [loginOpen, setloginOpen] = useState(false);
  const [validSignupForm, setvalidSignupForm] = useState(true);
  const [validLoginForm, setvalidLoginForm] = useState(true);
  const [signupSuccess, setsignupSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [verifying, setverifying] = useState(false);
  const [otp, setotp] = useState();
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [nameError, setnameError] = useState(false);
  const [emailError, setemailError] = useState(false);
  const [passwordError, setpasswordError] = useState(false);
  const [confpasswordError, setconfpasswordError] = useState(false);
  const [confirmpassword, setconfirmpassword] = useState("");
  const passwordRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,}$"
  );
  const emailRegex = new RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  const nameRegex = new RegExp(/^[a-z]+[a-z ,.'-]+[a-z]+$/i);
  useEffect(() => {
    setloginErrorMessage("");
    setsignupErrorMessage("");
    setotpErrorMessage("");
    if (
      name != "" &&
      email != "" &&
      password != "" &&
      confirmpassword != "" &&
      !nameError &&
      !emailError &&
      !passwordError &&
      !confpasswordError
    )
      setvalidSignupForm(false);
    else setvalidSignupForm(true);
  }, [name, email, password, confirmpassword]);
  useEffect(() => {
    setloginErrorMessage("");
    setsignupErrorMessage("");
    setotpErrorMessage("");
    if (email != "" && password != "" && !emailError && !passwordError)
      setvalidLoginForm(false);
    else setvalidLoginForm(true);
  }, [email, password]);
  const handleLogin = () => {
    setloginOpen(true);
    setsignupOpen(false);
  };
  const handleSignup = () => {
    setloginOpen(false);
    setsignupOpen(true);
  };
  const handleLoginRequest = () => {
    if (!validLoginForm) {
      setloginErrorMessage("");
      setsignupErrorMessage("");
      setotp();
      setSubmitting(true);
      setvalidLoginForm(true);
      let obj = {};
      obj.email = email;
      obj.password = password;
      fetch("https://attendance-auth.herokuapp.com/login", {
        // fetch("http://localhost:1111/login", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => {
          if (response.status >= 200 && response.status <= 299) {
            return response.json();
          } else {
            return response.text().then((text) => {
              throw new Error(text);
            });
          }
        })
        .then((datarec) => {
          localStorage.setItem("accessToken", datarec.cipherToken);
          setSubmitting(false);
          router.replace("/");
        })
        .catch((err) => {
          if (err.message.includes("You are not registered"))
            setloginErrorMessage(
              "Please login with a registered email address"
            );
          else setloginErrorMessage(err.message);

          setSubmitting(false);
          setvalidLoginForm(false);
        });
    }
  };
  const handleSignupRequest = () => {
    if (!validSignupForm) {
      setloginErrorMessage("");
      setsignupErrorMessage("");
      setotp();
      setSubmitting(true);
      setvalidSignupForm(true);
      let obj = {};
      obj.name = name;
      obj.email = email;
      obj.password = password;
      obj.confirmPassword = confirmpassword;
      fetch("https://attendance-auth.herokuapp.com/register", {
        // fetch("http://localhost:1111/register", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => {
          if (response.status >= 200 && response.status <= 299) {
            return response.json();
          } else {
            return response.text().then((text) => {
              throw new Error(text);
            });
          }
        })
        .then((datarec) => {
          localStorage.setItem("x-auth-token", datarec.authToken);
          setsignupSuccess(true);
          setsignupSuccessMessage(
            "Otp has been sent to your registered email address. Valid for 5 min."
          );
          setSubmitting(false);
        })
        .catch((err) => {
          if (err.message.includes("User has been already registered"))
            setsignupErrorMessage(
              "Already registered! Please login to continue."
            );
          else setsignupErrorMessage(err.message);
          setsignupSuccess(false);
          setSubmitting(false);
          setvalidSignupForm(false);
        });
    }
  };
  const handlePassword = (e) => {
    setpasswordError(!passwordRegex.test(e.target.value));
    if (confirmpassword)
      setconfpasswordError(e.target.value != confirmpassword ? true : false);
    setpassword(e.target.value);
  };
  const handleEmail = (e) => {
    setemailError(!emailRegex.test(e.target.value));
    setemail(e.target.value);
  };
  const handleName = (e) => {
    setnameError(!nameRegex.test(e.target.value));
    setname(e.target.value);
  };
  const handleconfPassword = (e) => {
    setconfpasswordError(password != e.target.value ? true : false);
    setconfirmpassword(e.target.value);
  };
  const handleVerifyOtpRequest = () => {
    if (otp.toString().length > 5) {
      setloginErrorMessage("");
      setsignupErrorMessage("");
      let obj = {};
      setverifying(true);
      obj.otp = otp;
      obj.sessionId = localStorage.getItem("x-auth-token");
      fetch("https://attendance-auth.herokuapp.com/verifyotp", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => {
          if (response.status >= 200 && response.status <= 299) {
            return response.json();
          } else {
            return response.text().then((text) => {
              throw new Error(text);
            });
          }
        })
        .then((datarec) => {
          if (datarec.accessToken) {
            localStorage.removeItem("x-auth-token");
            localStorage.setItem("accessToken", datarec.accessToken);
            router.replace("/");
          } else setotpErrorMessage("Please enter correct otp.");
          setverifying(false);
        })
        .catch((err) => {
          setsignupSuccess(false);
          setotp();
          if (
            err.message.includes("jwt expired") ||
            err.message.includes("jwt malformed")
          ) {
            setotpErrorMessage("Otp has been expired! Signup again.");
            localStorage.removeItem("x-auth-token");
          } else setotpErrorMessage(err.message);
          setverifying(false);
        });
    }
  };
  const handleOtp = (e) => {
    setotpErrorMessage("");
    setsignupSuccessMessage("");
    setotp(e.target.value);
  };
  return (
    <div className={styles.loginPage}>
       <Head>
          <title>Login</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
      <Segment placeholder style={{ padding: 0 }}>
        <div className={styles.loginPageContainer}>
          <div className={styles.loginLeft}>
            <img
              src="/ams.webp"
              alt="LoginImage"
              className={styles.loginImage}
            />
          </div>
          <div className={styles.loginRight}>
            <div>
              {loginOpen ? (
                <>
                  {loginErrorMessage ? (
                    <Message color="red" size="tiny">
                      {loginErrorMessage}
                    </Message>
                  ) : null}
                  <Form onSubmit={handleLoginRequest}>
                    <Form.Input
                      icon="mail"
                      iconPosition="left"
                      label="Email"
                      placeholder="Ex: abc@gmail.com"
                      type="email"
                      value={email}
                      onChange={(e) => setemail(e.target.value)}
                      disabled={submitting}
                    />
                    <Form.Input
                      icon="lock"
                      iconPosition="left"
                      label="Password"
                      type="password"
                      placeholder="Ex: P@ssword_0123"
                      value={password}
                      onChange={(e) => setpassword(e.target.value)}
                      disabled={submitting}
                    />
                    <Button
                      loading={submitting}
                      content="Login"
                      color="black"
                      disabled={validLoginForm}
                    />
                  </Form>
                </>
              ) : (
                <Button
                  content="Login"
                  icon="sign-in"
                  size="big"
                  onClick={handleLogin}
                />
              )}
            </div>
            <Divider horizontal>Or</Divider>
            <div>
              {signupOpen ? (
                <>
                  <Step.Group widths={2} size="mini" className={styles.step}>
                    <Step active={!signupSuccess} disabled={signupSuccess}>
                      <Icon name="signup" />
                      <Step.Content>
                        <Step.Title>Signup</Step.Title>
                      </Step.Content>
                    </Step>
                    <Step disabled={!signupSuccess} active={signupSuccess}>
                      <Icon name="key" />
                      <Step.Content>
                        <Step.Title>Verify Otp</Step.Title>
                      </Step.Content>
                    </Step>
                  </Step.Group>
                  {signupErrorMessage.length > 0 ? (
                    <Message color="red" size="tiny">
                      {signupErrorMessage}
                    </Message>
                  ) : null}
                  {signupSuccessMessage.length > 0 ? (
                    <Message color="green" size="tiny">
                      {signupSuccessMessage}
                    </Message>
                  ) : null}
                  {otpErrorMessage.length > 0 ? (
                    <Message color="red" size="tiny">
                      {otpErrorMessage}
                    </Message>
                  ) : null}
                  {signupSuccess ? (
                    <>
                      <Form onSubmit={handleVerifyOtpRequest}>
                        <Form.Input
                          icon="key"
                          iconPosition="left"
                          placeholder="Enter your otp"
                          type="number"
                          value={otp}
                          onChange={handleOtp}
                          disabled={submitting}
                        />
                        <Button
                          loading={verifying}
                          content="Verify"
                          color="black"
                          disabled={
                            otp
                              ? otp.toString().length <= 5
                                ? true
                                : false
                              : true
                          }
                        />
                      </Form>
                    </>
                  ) : (
                    <Form onSubmit={handleSignupRequest}>
                      <Form.Input
                        required
                        icon="user"
                        iconPosition="left"
                        label="Name"
                        error={
                          nameError &&
                          "Avoid using numbers and specials characters except(,.'-)"
                        }
                        placeholder="Ex: Mayur Agarwal"
                        type="text"
                        value={name}
                        onChange={handleName}
                      />
                      <Form.Input
                        required
                        icon="mail"
                        iconPosition="left"
                        label="Email"
                        error={
                          emailError &&
                          "Please provide correct email(Ex: abc@gmail.com)"
                        }
                        placeholder="Ex: abc@gmail.com"
                        type="email"
                        value={email}
                        onChange={handleEmail}
                        id="name"
                      />
                      <Form.Input
                        required
                        icon="lock"
                        iconPosition="left"
                        error={
                          passwordError &&
                          "Password must contain at least 1 Uppercase, 1 Lowercase, 1 Number, 1 Symbol(!@#$%^&*_=+-) and min 8 length."
                        }
                        label="Password"
                        type="password"
                        placeholder="Ex: P@ssword_0123"
                        value={password}
                        onChange={handlePassword}
                      />
                      <Form.Input
                        required
                        icon="lock"
                        iconPosition="left"
                        label="Confirm Password"
                        error={confpasswordError && "Password does not match"}
                        type="password"
                        placeholder="Ex: P@ssword_0123"
                        value={confirmpassword}
                        onChange={handleconfPassword}
                      />
                      <Button
                        loading={submitting}
                        content="Signup"
                        color="black"
                        disabled={validSignupForm}
                      />
                    </Form>
                  )}
                </>
              ) : (
                <Button
                  content="Sign up"
                  icon="signup"
                  size="big"
                  onClick={handleSignup}
                  disabled={submitting}
                />
              )}
            </div>
          </div>
        </div>
        {/* <Divider vertical></Divider>\
         */}
      </Segment>
    </div>
  );
}
