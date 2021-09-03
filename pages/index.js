import Head from "next/head";
import DatePicker from "react-datepicker";
import styles from "../styles/Home.module.css";
import "semantic-ui-css/semantic.min.css";
import "react-datepicker/dist/react-datepicker.css";
import {
  Popup,
  Button,
  Modal,
  Icon,
  Form,
  Label,
  Table,
  Menu,
  Pagination,
  Dimmer,
  Loader,
} from "semantic-ui-react";
import { useEffect, useState } from "react";
import dateFormat from "dateformat";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  let totalChanges = 0;
  const [login, setLogin] = useState(false);
  const [displayDate, setdisplayDate] = useState('');
  const [updateChange, setupdateChange] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [dummy, setDummy] = useState([]);
  const [name, setname] = useState("");
  const [salary, setsalary] = useState();
  const [date, setdate] = useState(new Date().toISOString().split('T')[0]);
  const [nameError, setnameError] = useState(false);
  const [addEmp, setAddEmp] = useState(true);
  const [submitting, setsubmitting] = useState(false);
  const nameRegex = new RegExp(/^[a-z]+[a-z ,.'-]+[a-z]+$/i);
  const screenWidth = useWindowDimensions();

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
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowDimensions;
  }
  useEffect(() => {
    if(screenWidth.width>1000)
    setdisplayDate(dateFormat(startDate, "dddd, mmmm dS, yyyy"))
  }, [screenWidth]);

  useEffect(() => {
    setLogin(localStorage.getItem("accessToken") != undefined ? true : false);
    if (localStorage.getItem("accessToken") == undefined)
      router.replace("/login");
    else {
      let obj = {};
      setsubmitting(true);
      obj.accessToken = localStorage.getItem("accessToken");
      fetch("http://localhost:1111/verifyaccess", {
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
            fetch("http://localhost:2222/getAttendance", {
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
                setData(val.data);
                fetch("http://localhost:2222/getAttendance", {
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
                    setDummy(val.data);
                    setsubmitting(false);
                  })
                  .catch((err) => {
                    console.log(err.message);
                    setsubmitting(false);
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
  }, []);
  useEffect(() => {
    if (name != "" && salary > 0 && date != "" && !nameError) setAddEmp(false);
    else setAddEmp(true);
  }, [name, salary, date]);
  const handleChange = (e) => {
    setIsOpen(!isOpen);
    setStartDate(e);
    console.log(totalChanges);
  };
  const handleClick = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };
  const handleName = (e) => {
    setnameError(!nameRegex.test(e.target.value));
    setname(e.target.value);
  };
  const handleEmpSubmit = () => {
    if (name != "" && salary > 0 && date != "" && !nameError) {
      if (localStorage.getItem("accessToken") == undefined)
        router.replace("/login");
      else {
        let obj = {};
        setsubmitting(true);
        obj.accessToken = localStorage.getItem("accessToken");
        fetch("http://localhost:1111/verifyaccess", {
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
                data: {
                  name: name.replace(/\w\S*/g, function (txt) {
                    return (
                      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
                    );
                  }),
                  salary: salary,
                  startDate: date,
                  attendance: {},
                },
              };
              fetch("http://localhost:2222/addemp", {
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
                  setData(val.data);
                  setOpen(false);
                  setname("");
                  setsalary();
                  setdate("");
                  setsubmitting(false);
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
    }
  };
  const handleAction = (key, val, id) => {
    console.log(totalChanges);
    data.forEach((value) => {
      if (value.id == id) {
        if (value.attendance.length)
          value.attendance.forEach((valu) => {
            if (valu.date == startDate.toISOString().slice(0, 10)) {
              if (key == "status" && val == "a") {
                delete valu["advance"];
                delete valu["remarks"];
              }
              valu[key] = val;
            }
          });
        else
          value.attendance.push({
            date: startDate.toISOString().slice(0, 10),
            [key]: val,
          });
        setData([...data]);
      }
    });
  };
  useEffect(() => {
    console.log(totalChanges);
    if (data.length > 0) {
      data.forEach((valuee) => {
        if (valuee.attendance.length) {
          valuee.attendance.forEach((valu) => {
            if (valu.date == startDate.toISOString().slice(0, 10)) {
              dummy.forEach((vale) => {
                if (vale.attendance.length) {
                  vale.attendance.forEach((value) => {
                    console.log(valu.date, value.date);
                    if (valu.date == value.date && valu.uid == value.uid) {
                      if (
                        valu.status != "undefined" &&
                        valu.status != value.status
                      )
                        totalChanges += 1;
                      if (
                        valu.advance != "undefined" &&
                        valu.advance != value.advance
                      )
                        totalChanges += 1;
                      if (
                        valu.remarks != "undefined" &&
                        valu.remarks != value.remarks
                      )
                        totalChanges += 1;
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
    setupdateChange(totalChanges);
    console.log(totalChanges);
  }, [data, dummy]);
  const cancelChanges = () => {
    setData(dummy);
    setupdateChange(0);
    totalChanges = 0;
  };
  const saveChanges = () => {
    let obj = {};
    obj.accessToken = localStorage.getItem("accessToken");
    setsubmitting(true);
    fetch("http://localhost:1111/verifyaccess", {
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
            data: data,
          };
          fetch("http://localhost:2222/updateemp", {
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
              setData(val.data);
              setupdateChange(0);
              totalChanges = 0;
              fetch("http://localhost:2222/getAttendance", {
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
                  setDummy(val.data);
                  setupdateChange(0);
                  totalChanges = 0;
                  setsubmitting(false);
                })
                .catch((err) => {
                  console.log(err.message);
                  setsubmitting(false);
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
  const ExpandedComponent = (val) => {
    return (
      <div className={styles.expanded}>
        <Button as="div" labelPosition="right" className={styles.expandLabel}>
          <Button color="black">
            <Icon name="money" />
            To Pay -
          </Button>
          <Label basic color="black" pointing="left">
            2,048
          </Label>
        </Button>
        <Button as="div" labelPosition="right" className={styles.expandLabel}>
          <Button color="orange">
            <Icon name="money" />
            Total Sal
          </Button>
          <Label basic color="orange" pointing="left">
            2,048
          </Label>
        </Button>
        <Button as="div" labelPosition="right" className={styles.expandLabel}>
          <Button color="grey">
            <Icon name="bell" />
            Advance
          </Button>
          <Label basic color="grey" pointing="left">
            2,048
          </Label>
        </Button>
        <Button as="div" labelPosition="right" className={styles.expandLabel}>
          <Button color="green">
            <Icon name="check" />
            Present-
          </Button>
          <Label basic color="green" pointing="left">
            2,048
          </Label>
        </Button>
        <Button as="div" labelPosition="right" className={styles.expandLabel}>
          <Button color="red">
            <Icon name="close" />
            Absent -
          </Button>
          <Label basic color="red" pointing="left">
            2,048
          </Label>
        </Button>
      </div>
    );
  };
  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>Create Next App</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className={styles.navbar}>
          <a onClick={() => rout.push("/")} className={styles.navlogo}>
            MAYUR
          </a>
          <div className={styles.calendarButton}>
            <Button
              content={displayDate}
              secondary
              onClick={handleClick}
              disabled={updateChange > 0 ? true : false}
            />
           
          </div>
          <Button animated style={{ margin: "0" }}>
            <Button.Content visible>
              {login ? "Logout" : "Login"}
            </Button.Content>
            <Button.Content hidden>
              <Icon name="arrow right" />
            </Button.Content>
          </Button>
        </div>
        <main className={styles.main}>
        {isOpen && (
              <DatePicker
                todayButton="Today"
                selected={startDate}
                onChange={handleChange}
                inline
              />
            )}
          <div className={styles.addanemp}>
            <Popup
              content="Add an employee"
              trigger={
                <i
                  className={`user plus icon ${styles.addUser}`}
                  onClick={() => setOpen((prev) => !prev)}
                ></i>
              }
            />
          </div>
          <div className={styles.tableResponsive}>
            <Table basic="very" unstackable textAlign="center">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell></Table.HeaderCell>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Action</Table.HeaderCell>
                  <Table.HeaderCell>Advance</Table.HeaderCell>
                  <Table.HeaderCell>Remarks</Table.HeaderCell>
                  <Table.HeaderCell>Edit/Delete</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {data.length > 0 && !submitting ? (
                  data.map((val, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>
                        <Popup
                          content={() => ExpandedComponent(val)}
                          trigger={
                            <Icon
                              name="attention"
                              className={styles.viewDetail}
                            />
                          }
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <Label ribbon>{val.name}</Label>
                      </Table.Cell>
                      <Table.Cell>
                        {
                          <div className="ui small buttons">
                            <Button
                              basic={
                                val.attendance.find(
                                  (value) =>
                                    value.date ==
                                      startDate.toISOString().slice(0, 10) &&
                                    value.status == "p"
                                ) == undefined
                                  ? true
                                  : false
                              }
                              color="green"
                              onClick={(e) =>
                                handleAction("status", "p", val.id)
                              }
                            >
                              P
                            </Button>
                            <div className="or"></div>
                            <Button
                              basic={
                                val.attendance.find(
                                  (value) =>
                                    value.date ==
                                      startDate.toISOString().slice(0, 10) &&
                                    value.status == "a"
                                ) == undefined
                                  ? true
                                  : false
                              }
                              color="red"
                              onClick={(e) =>
                                handleAction("status", "a", val.id)
                              }
                            >
                              A
                            </Button>
                          </div>
                        }
                      </Table.Cell>
                      <Table.Cell style={{ paddingLeft: "1rem" }}>
                        <div
                          className={`ui labeled input ${styles.advance}`}
                          style={{ marginRight: "2rem" }}
                        >
                          <div className="ui basic label">₹</div>
                          <input
                            type="number"
                            placeholder="Amount"
                            value={
                              val.attendance.find(
                                (value) =>
                                  value.date ==
                                    startDate.toISOString().slice(0, 10) &&
                                  value.advance > 0
                              ) == undefined
                                ? ""
                                : val.attendance.find(
                                    (value) =>
                                      value.date ==
                                        startDate.toISOString().slice(0, 10) &&
                                      value.advance > 0
                                  ).advance
                            }
                            disabled={
                              val.attendance.find(
                                (value) =>
                                  value.date ==
                                    startDate.toISOString().slice(0, 10) &&
                                  value.status == "a"
                              ) == undefined
                                ? false
                                : true
                            }
                            onChange={(e) =>
                              handleAction("advance", e.target.value, val.id)
                            }
                          />
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <form className="ui form">
                          <textarea
                            placeholder="Remarks..."
                            rows="1"
                            className={styles.remarks}
                            value={
                              val.attendance.find(
                                (value) =>
                                  value.date ==
                                    startDate.toISOString().slice(0, 10) &&
                                  value.remarks
                              ) == undefined
                                ? ""
                                : val.attendance.find(
                                    (value) =>
                                      value.date ==
                                        startDate.toISOString().slice(0, 10) &&
                                      value.remarks.length > 0
                                  ).remarks
                            }
                            onChange={(e) =>
                              handleAction("remarks", e.target.value, val.id)
                            }
                          ></textarea>
                        </form>
                      </Table.Cell>
                      <Table.Cell>
                        {
                          <div className="ui small buttons">
                            <Button basic color="green">
                              <Icon name="edit" />
                              Edit
                            </Button>
                            <div className="or"></div>
                            <Button basic color="red">
                              <Icon name="delete" />
                              Delete
                            </Button>
                          </div>
                        }
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
                  <Table.HeaderCell />
                  <Table.HeaderCell colSpan="12">
                    <Pagination defaultActivePage={5} totalPages={10} />
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer>
            </Table>
          </div>
          {updateChange > 0 && (
            <div className={styles.sticky}>
              <Label color="black" ribbon>
                {updateChange} unsaved changes
              </Label>
              <div>
                <Button content="Cancel" negative onClick={cancelChanges} />
                <Button content="Save" color="grey" onClick={saveChanges} />
              </div>
            </div>
          )}
        </main>
      </div>
      {
        <Modal
          size="mini"
          open={open}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
        >
          <Modal.Header>Employee Details</Modal.Header>
          <Modal.Content scrolling>
            <Form>
              <Form.Input
                required
                error={
                  nameError &&
                  "Avoid using numbers and specials characters except(,.'-)"
                }
                fluid
                label="Name"
                placeholder="Name"
                id="form-input-name"
                value={name}
                onChange={handleName}
              />
              <Form.Group>
                <Form.Input
                  required
                  fluid
                  width={6}
                  label="Salary"
                  placeholder="Salary/day"
                  type="number"
                  min="1"
                  value={salary}
                  onChange={(e) => setsalary(e.target.value)}
                />
                <Form.Input
                  required
                  width={10}
                  fluid
                  label="Start Date"
                  type="date"
                  max={(new Date()).toISOString().split('T')[0]}
                  value={date}
                  onChange={(e) => setdate(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color="red" onClick={() => setOpen(false)}>
              <Icon name="remove" /> Cancel
            </Button>
            <Button
              color="green"
              onClick={() => setOpen(false)}
              disabled={addEmp}
              onClick={handleEmpSubmit}
            >
              <Icon name="checkmark" /> Add
            </Button>
          </Modal.Actions>
        </Modal>
      }
    </>
  );
}
