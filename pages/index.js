import Head from "next/head";
import DatePicker from "react-datepicker";
import styles from "../styles/Home.module.css";
import "semantic-ui-css/semantic.min.css";
import "react-datepicker/dist/react-datepicker.css";
import Navbar from "../navbar";
import {
  Popup,
  Button,
  Modal,
  Icon,
  Form,
  Label,
  Table,
  Header,
  Pagination,
  Dimmer,
  Loader,
  Dropdown,
  Statistic,
  Divider,
} from "semantic-ui-react";
import { useEffect, useState } from "react";
import dateFormat from "dateformat";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [activePage, setactivePage] = useState(1);
  const [totalPage, settotalPage] = useState(2);
  const [calAlign, setcalAlign] = useState("40vw");
  const [searched, setsearched] = useState(false);
  const [searchContent, setsearchContent] = useState("");
  const [receivedData, setreceviedData] = useState(true);
  let totalChanges = 0;
  const [dataset, setdataset] = useState(false);
  const [login, setLogin] = useState(false);
  const [displayDate, setdisplayDate] = useState("");
  const [updateChange, setupdateChange] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [datas, setDatas] = useState([]);
  const [dummy, setDummy] = useState([]);
  const [name, setname] = useState("");
  const [salary, setsalary] = useState();
  const [date, setdate] = useState(new Date().toISOString().split("T")[0]);
  const [nameError, setnameError] = useState(false);
  const [addEmp, setAddEmp] = useState(true);
  const [submitting, setsubmitting] = useState(false);
  const nameRegex = new RegExp(/^[a-z]+[a-z ,.'-]+[a-z]+$/i);
  const screenWidth = useWindowDimensions();
  const options = [
    {
      key: "all",
      text: "All",
      value: "all",
      content: "All",
    },
    {
      key: "name",
      text: "Name",
      value: "name",
      content: "Name",
    },
    {
      key: "action",
      text: "Action",
      value: "action",
      content: "Action",
    },
    {
      key: "advance",
      text: "Advance",
      value: "advance",
      content: "Advance",
    },
  ];
  const [searchDrowndown, setsearchDrowndown] = useState(options[0].content);
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
    if (screenWidth.width > 1000) {
      setdisplayDate(dateFormat(startDate, "dddd, mmmm dS, yyyy"));
      setcalAlign("40vw");
    }
    if (screenWidth.width > 800 && screenWidth.width < 1000) {
      setdisplayDate(dateFormat(startDate, "dddd, mmmm dS, yyyy"));
      setcalAlign("35vw");
    }
    if (screenWidth.width > 600 && screenWidth.width < 800) {
      setdisplayDate(dateFormat(startDate, "dddd, mmmm dS, yyyy"));
      setcalAlign("30vw");
    }
    if (screenWidth.width > 450 && screenWidth.width < 600) {
      setdisplayDate(dateFormat(startDate, "mmmm dS, yyyy"));
      setcalAlign("30vw");
    }
    if (screenWidth.width > 400 && screenWidth.width < 450) {
      setdisplayDate(dateFormat(startDate, "ddd,dS"));
      setcalAlign("40vw");
    }
    if (screenWidth.width > 300 && screenWidth.width < 400) {
      setdisplayDate(dateFormat(startDate, "ddd,dS"));
      setcalAlign("35vw");
    }
  }, [screenWidth, startDate]);

  useEffect(() => {
    setLogin(localStorage.getItem("accessToken") != undefined ? true : false);
    if (localStorage.getItem("accessToken") == undefined)
      router.replace("/login");
    else {
      localStorage.setItem("updateChange", 0);
      let obj = {};
      setsubmitting(true);
      setreceviedData(false);
      obj.accessToken = localStorage.getItem("accessToken");
      fetch("https://attendance-auth.vercel.app/verifyaccess", {
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
            fetch("https://attendance-attend.vercel.app/getAttendance", {
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
                setDatas(val.data);
                fetch("https://attendance-attend.vercel.app/getAttendance", {
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
                    setreceviedData(true);
                  })
                  .catch((err) => {
                    setsubmitting(false);
                    setreceviedData(true);
                  });
              })
              .catch((err) => {
                setsubmitting(false);
                setreceviedData(true);
              });
          } else {
            localStorage.removeItem("accessToken");
            router.replace("/login");
          }
        })
        .catch((err) => {
          setsubmitting(false);
          setreceviedData(true);
          setreceviedData(true);
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
    localStorage.setItem("updateChange", updateChange);
    setStartDate(e);
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
        fetch("https://attendance-auth.vercel.app/verifyaccess", {
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
              fetch("https://attendance-attend.vercel.app/addemp", {
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
                  setDatas(val.data);
                  setOpen(false);
                  setname("");
                  setsalary();
                  setdate("");
                  setsubmitting(false);
                  setreceviedData(true);
                })
                .catch((err) => {
                  setsubmitting(false);
                  setreceviedData(true);
                });
            } else {
              localStorage.removeItem("accessToken");
              router.replace("/login");
            }
          })
          .catch((err) => {
            setsubmitting(false);
            setreceviedData(true);
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
        setdataset((prevState) => !prevState);
      }
    });
  };
  useEffect(() => {
    totalChanges = Number(localStorage.getItem("updateChange"));
    if (totalChanges == undefined) totalChanges = 0;
    if (data.length > 0) {
      data.forEach((valuee) => {
        if (valuee.attendance.length) {
          valuee.attendance.forEach((valu) => {
            if (valu.date == startDate.toISOString().slice(0, 10)) {
              dummy.forEach((vale) => {
                if (vale.attendance.length) {
                  vale.attendance.forEach((value) => {
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
  }, [dataset, dummy]);

  useEffect(() => {
    settotalPage(Math.ceil(datas.length / 5));
    let max = activePage * 5;
    let min = (activePage - 1) * 5;
    let dum = [];
    let dumm = [];
    if (searchContent) {
      datas.forEach((val) => {
        if (searchDrowndown == "Name") {
          val.attendance.forEach((value) => {
            if (value.date == startDate.toISOString().slice(0, 10)) {
              if (val.name.toLowerCase().includes(searchContent))
                dumm.push(val);
            }
          });
        }
        if (searchDrowndown == "All") {
          val.attendance.forEach((value) => {
            if (value.date == startDate.toISOString().slice(0, 10)) {
              if (val.name.toLowerCase().includes(searchContent))
                dumm.push(val);
              if (value.status == "p") {
                if ("present".includes(searchContent)) dumm.push(val);
              }
              if (value.status == "a") {
                if ("absent".includes(searchContent)) dumm.push(val);
              }
              if (value.advance >= Number(searchContent)) dumm.push(val);
            }
          });
        }
        if (searchDrowndown == "Action") {
          val.attendance.forEach((value) => {
            if (value.date == startDate.toISOString().slice(0, 10)) {
              if (value.status == "p") {
                if ("present".includes(searchContent)) dumm.push(val);
              }
              if (value.status == "a") {
                if ("absent".includes(searchContent)) dumm.push(val);
              }
            }
          });
        }
        if (searchDrowndown == "Advance") {
          val.attendance.forEach((value) => {
            if (value.date == startDate.toISOString().slice(0, 10)) {
              if (value.advance >= Number(searchContent)) dumm.push(val);
            }
          });
        }
      });
      settotalPage(Math.ceil(dumm.length / 5));
      for (let i = min; i < dumm.length; i++) {
        if (i < max) dum.push(dumm[i]);
      }
      localStorage.setItem("updateChange", 0);
    } else {
      for (let i = min; i < datas.length; i++) {
        if (i < max) dum.push(datas[i]);
      }
    }
    localStorage.setItem("updateChange", updateChange);
    setData(dum);
  }, [datas, activePage, searchContent]);

  const cancelChanges = () => {
    setupdateChange(0);
    localStorage.setItem("updateChange", 0);
    let obj = {};
    setsubmitting(true);
    obj.accessToken = localStorage.getItem("accessToken");
    fetch("https://attendance-auth.vercel.app/verifyaccess", {
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
          fetch("https://attendance-attend.vercel.app/getAttendance", {
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
              setDatas(val.data);
              fetch("https://attendance-attend.vercel.app/getAttendance", {
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
                  setreceviedData(true);
                })
                .catch((err) => {
                  setsubmitting(false);
                  setreceviedData(true);
                });
            })
            .catch((err) => {
              setsubmitting(false);
              setreceviedData(true);
            });
        } else {
          localStorage.removeItem("accessToken");
          router.replace("/login");
        }
      })
      .catch((err) => {
        setsubmitting(false);
        setreceviedData(true);
        if (
          err.message.includes("jwt expired") ||
          err.message.includes("jwt malformed")
        ) {
          localStorage.removeItem("accessToken");
          router.replace("/login");
        }
      });
  };
  const saveChanges = () => {
    let obj = {};
    obj.accessToken = localStorage.getItem("accessToken");
    setsubmitting(true);
    fetch("https://attendance-auth.vercel.app/verifyaccess", {
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
          fetch("https://attendance-attend.vercel.app/updateemp", {
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
              setDatas(val.data);
              setupdateChange(0);
              totalChanges = 0;
              localStorage.setItem("updateChange", 0);
              fetch("https://attendance-attend.vercel.app/getAttendance", {
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
                  localStorage.setItem("updateChange", 0);
                  setsubmitting(false);
                  setreceviedData(true);
                })
                .catch((err) => {
                  setsubmitting(false);
                  setreceviedData(true);
                });
            })
            .catch((err) => {
              setsubmitting(false);
              setreceviedData(true);
            });
        } else {
          localStorage.removeItem("accessToken");
          router.replace("/login");
        }
      })
      .catch((err) => {
        setsubmitting(false);
        setreceviedData(true);
        if (
          err.message.includes("jwt expired") ||
          err.message.includes("jwt malformed")
        ) {
          localStorage.removeItem("accessToken");
          router.replace("/login");
        }
      });
  };
  const handlePageChange = (e, data) => {
    setactivePage(data.activePage);
  };
  const handleSearchDropdown = (e) => {
    setsearchContent("");
    setsearchDrowndown(e.target.textContent);
  };
  const searchValue = (e) => {
    setsearchContent(e.target.value.toLowerCase());
    setactivePage(1);
  };
  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>AMS</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Navbar />
        <div className={styles.calendarButton} style={{ left: calAlign }}>
          <Button content={displayDate} secondary onClick={handleClick} />
          {isOpen && (
            <DatePicker
              todayButton="Today"
              selected={startDate}
              onChange={handleChange}
              maxDate={new Date()}
              inline
            />
          )}
        </div>
        <main className={styles.main}>
          <div className={styles.addanemp}>
            <div className={styles.search}>
              <Dropdown
                inline
                onChange={handleSearchDropdown}
                header="Field based search"
                options={options}
                defaultValue={options[0].value}
              />
              <div className="search-box">
                <button className="btn-search">
                  <Icon name="search" />
                </button>
                <input
                  type="text"
                  className="input-search"
                  placeholder="Type to Search..."
                  value={searchContent}
                  onChange={searchValue}
                />
              </div>
            </div>
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
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Action</Table.HeaderCell>
                  <Table.HeaderCell>Advance</Table.HeaderCell>
                  <Table.HeaderCell>Remarks</Table.HeaderCell>
                  <Table.HeaderCell>Edit/Delete</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {(data.length > 0 || searchContent || receivedData) &&
                !submitting ? (
                  data.map((val, index) => (
                    <Table.Row
                      key={index}
                      className={
                        new Date(val.startDate).getTime() <=
                        new Date(startDate).getTime()
                          ? null
                          : styles.colorRow
                      }
                      hidden={
                        new Date(val.startDate).getTime() <=
                        new Date(startDate).getTime()
                          ? false
                          : true
                      }
                    >
                      <Table.Cell>
                        <Label color="black" ribbon>
                          {val.name}
                        </Label>
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
                            disabled={
                              new Date(val.startDate).getTime() <=
                              new Date(startDate).getTime()
                                ? false
                                : true
                            }
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
                            <Button
                              basic
                              color="green"
                              onClick={() => router.push(`/${val.id}`)}
                            >
                              <Icon name="edit" />
                              View/Edit
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
                  <Table.HeaderCell colSpan="12">
                    <Pagination
                      defaultActivePage={activePage}
                      totalPages={totalPage}
                      onPageChange={handlePageChange}
                    />
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
                  max={new Date().toISOString().split("T")[0]}
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
