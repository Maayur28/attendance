import React from "react";
import { useRouter } from "next/router";
import styles from './styles/Home.module.css';
import { Button,Icon } from "semantic-ui-react";
import { useState,useEffect } from "react";

export default function Navbar() {
    const rout=useRouter();
    const [login, setLogin] = useState(false);
    useEffect(() => {
        setLogin(localStorage.getItem("accessToken") != undefined ? true : false);
    }, [])
    return (
    <div className={styles.navbar}>
      <a onClick={() => rout.push("/")} className={styles.navlogo}>
        MAYUR
      </a>
      <Button animated style={{ margin: "0" }}>
        <Button.Content visible>{login ? "Logout" : "Login"}</Button.Content>
        <Button.Content hidden>
          <Icon name="arrow right" />
        </Button.Content>
      </Button>
    </div>
  );
}
