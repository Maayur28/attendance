import React from "react";
import Head from "next/head";
import Navbar from "../navbar";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import {
  Label,
  Table,
  Dimmer,
  Loader,
  TextArea,
  Statistic,
  Icon,
  Divider,
  Header,
  Modal,
  Form,
  Button,
  Confirm,
} from "semantic-ui-react";
import { useState, useEffect } from "react";
import "semantic-ui-css/semantic.min.css";
export default function Slug() {
  const router = useRouter();
  const [submitting, setsubmitting] = useState(false);
  const [updating, setupdating] = useState(false);
  const [data, setData] = useState([]);
  const [login, setLogin] = useState(false);
  const [sal, setsal] = useState(0);
  const [name, setname] = useState("");
  const [open, setOpen] = useState(false);
  const [startDa, setstartDa] = useState("");
  const [paidOpen, setpaidOpen] = useState(false);
  const [currentDate, setcurrentDate] = useState("");
  useEffect(() => {
    setLogin(localStorage.getItem("accessToken") != undefined ? true : false);
    if (localStorage.getItem("accessToken") == undefined) {
      router.replace("/login");
    }
    if (
      router.query.id != undefined &&
      localStorage.getItem("accessToken") != undefined
    ) {
      let obj = {};
      setsubmitting(true);
      obj.accessToken = localStorage.getItem("accessToken");
      fetch("https://attendance-auth.herokuapp.com/verifyaccess", {
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
            localStorage.setItem("accessToken", datarec.accessToken);
            fetch("https://attendance-attend.herokuapp.com/getAttendance", {
              headers: {
                userid: datarec.userid,
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
              .then((val) => {
                val.data.forEach((element) => {
                  if (element.id == router.query.id) {
                    setstartDa(element.startDate);
                    setData(element.attendance);
                    setsal(element.salary);
                    setname(element.name);
                    setsubmitting(false);
                  }
                });
              })
              .catch((err) => {
                console.log(err.message);
                setsubmitting(false);
              });
          } else {
            localStorage.removeItem("accessToken");
            router.replace("/login");
          }
        })
        .catch((err) => {
          setsubmitting(false);
          if (
            err.message.includes("jwt expired") ||
            err.message.includes("jwt malformed")
          ) {
            localStorage.removeItem("accessToken");
            router.replace("/login");
          }
        });
    }
  }, [router.query.id]);

  const ExpandedComponent = () => {
    let absent = 0,
      present = 0,
      advance = 0,
      datesnotmarked = [];
    for (const da of data) {
      if (da.status == "p") {
        advance += da.advance == undefined ? 0 : da.advance;
        present += 1;
      }
      if (da.status == "a") absent += 1;
      if (da.status != "p" && da.status != "a") {
        datesnotmarked.push(da.date);
      }
    }
    return (
      <div className={styles.expanded}>
        <div className={styles.headProf}>
          <Header as="h2" style={{ margin: "0" }}>
            <Icon name="user secret" />
            {name}
          </Header>
          <Header as="h2" style={{ margin: "0", paddingLeft: "10px" }}>
            <Icon name="clock" />
            {startDa}
          </Header>
        </div>
        <Statistic.Group size="tiny" className={styles.stats}>
          <Statistic color="purple">
            <Statistic.Value>
              <Icon name="rupee" />
              {sal * present - advance}
            </Statistic.Value>
            <div>Total Amount</div>
          </Statistic>

          <Statistic color="yellow">
            <Statistic.Value>
              <Icon name="rupee" />
              {present * sal}
            </Statistic.Value>
            <div>Total Salary</div>
          </Statistic>

          <Statistic color="orange">
            <Statistic.Value>
              <Icon name="rupee" />
              {advance}
            </Statistic.Value>
            <div>Advance</div>
          </Statistic>

          <Statistic color="green">
            <Statistic.Value>{present}</Statistic.Value>
            <div>Present</div>
          </Statistic>
          <Statistic color="red">
            <Statistic.Value>{absent}</Statistic.Value>
            <div>Absent</div>
          </Statistic>
        </Statistic.Group>
        <Divider horizontal style={{ marginTop: "20px" }}>
          <Header as="h4">
            <Icon name="tag" />
            Data not available(for Dates)
          </Header>
        </Divider>
        <div className={styles.notMarked}>
          {datesnotmarked.map((val, index) => (
            <Label
              color="black"
              key={index}
              style={{ cursor: "pointer" }}
              onClick={() => openModal({ date: val })}
            >
              {val}
            </Label>
          ))}
        </div>
      </div>
    );
  };
  const openModal = (val) => {
    setcurrentDate(val.date);
    setOpen((prev) => !prev);
  };
  const handleAction = (key, val) => {
    data.forEach((valu) => {
      if (valu.date == currentDate) {
        if (key == "advance") valu[key] = Number(val);
        else valu[key] = val;
      }
    });
    setData([...data]);
  };
  const handleUpdate = () => {
    let obj = {};
    obj.accessToken = localStorage.getItem("accessToken");
    setupdating(true);
    fetch("https://attendance-auth.herokuapp.com/verifyaccess", {
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
          localStorage.setItem("accessToken", datarec.accessToken);
          let obj = {
            userid: datarec.userid,
            id: router.query.id,
            data: data,
          };
          fetch("https://attendance-attend.herokuapp.com/updateempid", {
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
            .then((val) => {
              val.data.forEach((element) => {
                if (element.id == router.query.id) {
                  setData(element.attendance);
                  setstartDa(element.startDate);
                  setsal(element.salary);
                  setname(element.name);
                  setupdating(false);
                  setOpen(false);
                }
              });
            })
            .catch((err) => {
              console.log(err.message);
              setupdating(false);
            });
        } else {
          localStorage.removeItem("accessToken");
          router.replace("/login");
        }
      })
      .catch((err) => {
        setsubmitting(false);
        if (
          err.message.includes("jwt expired") ||
          err.message.includes("jwt malformed")
        ) {
          localStorage.removeItem("accessToken");
          router.replace("/login");
        }
      });
  };
  const handleCancel = () => {
    let obj = {};
    setsubmitting(true);
    obj.accessToken = localStorage.getItem("accessToken");
    fetch("https://attendance-auth.herokuapp.com/verifyaccess", {
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
          localStorage.setItem("accessToken", datarec.accessToken);
          fetch("https://attendance-attend.herokuapp.com/getAttendance", {
            headers: {
              userid: datarec.userid,
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
            .then((val) => {
              val.data.forEach((element) => {
                if (element.id == router.query.id) {
                  setData(element.attendance);
                  setstartDa(element.startDate);
                  setsal(element.salary);
                  setname(element.name);
                  setsubmitting(false);
                  setOpen(false);
                }
              });
            })
            .catch((err) => {
              console.log(err.message);
              setsubmitting(false);
            });
        } else {
          localStorage.removeItem("accessToken");
          router.replace("/login");
        }
      })
      .catch((err) => {
        setsubmitting(false);
        if (
          err.message.includes("jwt expired") ||
          err.message.includes("jwt malformed")
        ) {
          localStorage.removeItem("accessToken");
          router.replace("/login");
        }
      });
  };
  const handlePaidCancel = () => {
    setpaidOpen(!paidOpen);
  };
  const handlePaidConfirm = () => {
    let obj = {};
    setsubmitting(true);
    obj.accessToken = localStorage.getItem("accessToken");
    fetch("https://attendance-auth.herokuapp.com/verifyaccess", {
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
          localStorage.setItem("accessToken", datarec.accessToken);
          let obj = {
            userid: datarec.userid,
            id: router.query.id,
          };
          fetch("https://attendance-attend.herokuapp.com/paid", {
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
            .then((val) => {
              val.data.forEach((element) => {
                if (element.id == router.query.id) {
                  setData(element.attendance);
                  setstartDa(element.startDate);
                  setsal(element.salary);
                  setname(element.name);
                  setsubmitting(false);
                  setpaidOpen(false);
                }
              });
            })
            .catch((err) => {
              console.log(err.message);
              setsubmitting(false);
            });
        } else {
          localStorage.removeItem("accessToken");
          router.replace("/login");
        }
      })
      .catch((err) => {
        setsubmitting(false);
        if (
          err.message.includes("jwt expired") ||
          err.message.includes("jwt malformed")
        ) {
          localStorage.removeItem("accessToken");
          router.replace("/login");
        }
      });
  };
  return (
    <>
    <Head>
          <title>{name}</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
      <div className={styles.container}>
        <Navbar />
        {ExpandedComponent()}
        <div className={styles.mainId}>
          <Table basic="very" unstackable textAlign="center">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell></Table.HeaderCell>
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Advance</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {(data.length > 0 || !updating) && !submitting ? (
                data.map((val, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>
                      <Icon
                        name="edit"
                        size="large"
                        style={{ cursor: "pointer" }}
                        onClick={() => openModal(val)}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Label ribbon>{val.date}</Label>
                    </Table.Cell>
                    <Table.Cell>
                      <Label
                        circular
                        color={
                          val.status == "a"
                            ? "red"
                            : val.status == "p"
                            ? "green"
                            : "orange"
                        }
                      >
                        {val.status ? val.status.toUpperCase() : "?"}
                      </Label>
                    </Table.Cell>
                    <Table.Cell>
                      <div>
                        <Label color="teal">
                          {val.advance == undefined ? 0 : val.advance}
                        </Label>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <>
                  {data.length == 0 ? (
                    <Dimmer active>
                      <Loader indeterminate>Preparing Data</Loader>
                    </Dimmer>
                  ) : (
                    <Dimmer active>
                      <Loader indeterminate>Updating Data</Loader>
                    </Dimmer>
                  )}
                </>
              )}
            </Table.Body>
            <Table.Footer fullWidth>
              <Table.Row>
                <Table.HeaderCell colSpan="4">
                  <Button
                    floated="right"
                    icon
                    labelPosition="left"
                    secondary
                    size="small"
                    onClick={() => setpaidOpen(!paidOpen)}
                    disabled={data.length > 0 ? false : true}
                  >
                    <Icon name="payment" /> Paid
                  </Button>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        </div>
      </div>
      {
        <>
          <Modal
            size="mini"
            open={open}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
          >
            <Modal.Header>{currentDate}</Modal.Header>
            <Modal.Content scrolling>
              <Button
                content="Actions-"
                style={{ marginBottom: "10px", height: "40px" }}
                label={{
                  basic: true,
                  content: (
                    <div className="ui small buttons">
                      <Button
                        color="green"
                        basic={
                          data.find(
                            (value) =>
                              value.date == currentDate && value.status == "p"
                          ) == undefined
                            ? true
                            : false
                        }
                        onClick={(e) => handleAction("status", "p")}
                      >
                        P
                      </Button>
                      <div className="or"></div>
                      <Button
                        color="red"
                        basic={
                          data.find(
                            (value) =>
                              value.date == currentDate && value.status == "a"
                          ) == undefined
                            ? true
                            : false
                        }
                        onClick={(e) => handleAction("status", "a")}
                      >
                        A
                      </Button>
                    </div>
                  ),
                }}
                labelPosition="right"
              />
              <Button
                content="Advance"
                style={{ marginBottom: "10px", height: "40px" }}
                label={{
                  basic: true,
                  content: (
                    <div
                      className={`ui labeled input ${styles.advance}`}
                      style={{ marginRight: "2rem" }}
                    >
                      <div className="ui basic label">₹</div>
                      <input
                        type="number"
                        value={
                          data.find(
                            (val) => val.date == currentDate && val.advance > 0
                          ) == undefined
                            ? ""
                            : data.find(
                                (value) =>
                                  value.date == currentDate && value.advance > 0
                              ).advance
                        }
                        placeholder="Amount"
                        onChange={(e) =>
                          handleAction("advance", e.target.value)
                        }
                      />
                    </div>
                  ),
                }}
                labelPosition="right"
              />
              <Button
                content="Remarks"
                style={{ height: "40px" }}
                label={{
                  basic: true,
                  content: (
                    <form className="ui form">
                      <textarea
                        placeholder="Remarks..."
                        rows="1"
                        className={styles.remarks}
                        value={
                          data.find(
                            (val) => val.date == currentDate && val.remarks
                          ) == undefined
                            ? ""
                            : data.find(
                                (value) =>
                                  value.date == currentDate &&
                                  value.remarks.length > 0
                              ).remarks
                        }
                        onChange={(e) =>
                          handleAction("remarks", e.target.value)
                        }
                      ></textarea>
                    </form>
                  ),
                }}
                labelPosition="right"
              />
            </Modal.Content>
            <Modal.Actions>
              <Button color="red" onClick={handleCancel} disabled={submitting}>
                <Icon name="remove" /> Cancel
              </Button>
              <Button
                color="green"
                onClick={handleUpdate}
                disabled={submitting}
              >
                <Icon name="checkmark" /> Update
              </Button>
            </Modal.Actions>
          </Modal>
          <Confirm
            header="It will reset current and starts new attendance from tomorrow."
            open={paidOpen}
            onCancel={handlePaidCancel}
            onConfirm={handlePaidConfirm}
            size="mini"
          />
        </>
      }
    </>
  );
}
