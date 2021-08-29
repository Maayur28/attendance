import Head from "next/head";
import {
  Button,
  Divider,
  Form,
  Grid,
  Segment,
  Dimmer,
  Loader,
} from "semantic-ui-react";
import styles from "../styles/Home.module.css";
import "semantic-ui-css/semantic.min.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [signupOpen, setsignupOpen] = useState(false);
  const [loginOpen, setloginOpen] = useState(false);
  const [OrHorizontal, setOrHorizontal] = useState(false);
  const [validSignupForm, setvalidSignupForm] = useState(true);
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
  const screenWidth = useWindowDimensions();
  const passwordRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,}$"
  );
  const emailRegex = new RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  const nameRegex = new RegExp(/^[a-z]+[a-z ,.'-]+[a-z]+$/i);
  function getWindowDimensions() {
    if (typeof window != "undefined") {
      const { innerWidth: width, innerHeight: height } = window;
      return {
        width,
      };
    }
  }
  function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(
      getWindowDimensions()
    );

    useEffect(() => {
      setsignupSuccess(localStorage.getItem('x-auth-token')!=undefined?true:false);
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowDimensions;
  }
  useEffect(() => {
    if (screenWidth.width <= 767) {
      setOrHorizontal(true);
    }
    if (screenWidth.width > 767) {
      setOrHorizontal(false);
    }
  }, [screenWidth]);
  useEffect(() => {
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
  const handleLogin = () => {
    setloginOpen(true);
    setsignupOpen(false);
  };
  const handleSignup = () => {
    setloginOpen(false);
    setsignupOpen(true);
  };
  const handleLoginRequest = () => {
    setloginOpen(true);
    setsignupOpen(false);
  };
  const handleSignupRequest = () => {
    if (!validSignupForm) {
      setSubmitting(true);
      setvalidSignupForm(true);
      let obj = {};
      obj.name = name;
      obj.email = email;
      obj.password = password;
      obj.confirmPassword = confirmpassword;
      fetch("http://localhost:1111/register", {
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
          localStorage.setItem("x-auth-token", datarec.refreshToken);
          if (datarec.refreshToken) setsignupSuccess(true);
          // setname("");
          // setemail("");
          // setpassword("");
          // setconfirmpassword("");
          setSubmitting(false);
        })
        .catch((err) => {
          console.log(err.message);
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
      let obj = {};
      setverifying(true);
      obj.otp = otp;
      obj.sessionId = localStorage.getItem("x-auth-token");
      fetch("http://localhost:1111/verifyotp", {
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
          if (datarec.sessonId) {
            localStorage.removeItem("x-auth-token");
            localStorage.setItem("sessionId", datarec.sessonId);
          }
          setverifying(false);
          router.replace("attendance");
        })
        .catch((err) => {
          localStorage.removeItem('x-auth-token');
          setsignupSuccess(false);
          console.log(err.message);
          setverifying(false);
        });
    }
  };
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {
        <Segment placeholder className={styles.loginPage}>
          <Grid columns={2} relaxed="very" stackable>
            <Grid.Column verticalAlign="middle">
              {loginOpen ? (
                <Form>
                  <Form.Input
                    icon="mail"
                    iconPosition="left"
                    label="Email"
                    placeholder="Ex: abc@gmail.com"
                    type="email"
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                  />
                  <Form.Input
                    icon="lock"
                    iconPosition="left"
                    label="Password"
                    type="password"
                    placeholder="Ex: P@ssword_0123"
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                  />
                  <Button
                    content="Login"
                    color="black"
                    onClick={handleLoginRequest}
                  />
                </Form>
              ) : (
                <Button
                  content="Login"
                  icon="sign-in"
                  size="big"
                  onClick={handleLogin}
                />
              )}
            </Grid.Column>
            <Grid.Column verticalAlign="middle">
              {signupOpen ? (
                <>
                  {signupSuccess ? (
                    <Form onSubmit={handleVerifyOtpRequest}>
                      <Form.Input
                        icon="key"
                        iconPosition="left"
                        placeholder="Enter your otp"
                        type="number"
                        value={otp}
                        onChange={(e) => setotp(e.target.value)}
                      />
                      <Button
                        loading={verifying}
                        content="Verify"
                        color="black"
                        disabled={
                          otp
                            ? otp.toString().length < 5
                              ? true
                              : false
                            : true
                        }
                      />
                    </Form>
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
                />
              )}
            </Grid.Column>
          </Grid>
          <Divider vertical>Or</Divider>
        </Segment>
      }
    </div>
  );
}
