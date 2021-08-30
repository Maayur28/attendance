import Head from "next/head";
import DataTable from "react-data-table-component";
import DatePicker from "react-datepicker";
import styles from "../styles/Home.module.css";
import "semantic-ui-css/semantic.min.css";
import "react-datepicker/dist/react-datepicker.css";
import { Popup, Button, Modal, Icon, Form } from "semantic-ui-react";
import { useEffect, useState, useMemo, useCallback } from "react";
import differenceBy from "lodash/differenceBy";
import dateFormat from "dateformat";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [check, setcheck] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [data, setData] = useState([]);
  const [name, setname] = useState("");
  const [salary, setsalary] = useState();
  const [date, setdate] = useState("");
  const [nameError, setnameError] = useState(false);
  const [addEmp, setAddEmp] = useState(true);
  const pre = new Date();
  const nameRegex = new RegExp(/^[a-z]+[a-z ,.'-]+[a-z]+$/i);
  useEffect(() => {
    if (localStorage.getItem("accessToken") == undefined)
      router.replace("/login");
    else {
      let obj = {};
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
              })
              .catch((err) => {
                console.log(err.message);
              });
          } else {
            localStorage.removeItem("accessToken");
            router.replace("/login");
          }
        })
        .catch((err) => {
          console.log(err.message);
          if (
            err.message.includes("jwt expired") ||
            err.message.includes("jwt malformed")
          ) {
            localStorage.removeItem("accessToken");
            router.replace("/login");
          }
          // localStorage.removeItem('accessToken');
          // router.replace("/login");
        });
    }
  }, []);
  const handleRowSelected = useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);
  const contextActions = () => {
    const handleDelete = () => {
      if (
        window.confirm(
          `Are you sure you want to delete:\r ${selectedRows.map(
            (r) => r.name
          )}?`
        )
      ) {
        setToggleCleared(!toggleCleared);
        setData(differenceBy(data, selectedRows, "name"));
      }
    };
    return (
      <Button
        key="delete"
        onClick={handleDelete}
        style={{ backgroundColor: "red" }}
        icon
      >
        Delete
      </Button>
    );
  }
  useEffect(() => {
    if(name!='' && salary>0 && date!='' && !nameError)
      setAddEmp(false);
      else
      setAddEmp(true);
  }, [name,salary,date])
  const handleChange = (e) => {
    setIsOpen(!isOpen);
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
  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Action",
      button: true,
      width: "150px",
      cell: () => (
        <div className="ui small buttons">
          <button
            className={`ui positive button ${check ? "" : "basic"}`}
            onClick={() => setcheck((prev) => !prev)}
          >
            P
          </button>
          <div className="or"></div>
          <button className="ui negative button">A</button>
        </div>
      ),
    },
    {
      name: "Advance",
      button: true,
      width: "150px",
      cell: () => (
        <div className={`ui labeled input ${styles.advance}`}>
          <div className="ui basic label">₹</div>
          <input type="number" placeholder="Amount" />
        </div>
      ),
    },
    {
      name: "Remark",
      button: true,
      width: "250px",
      cell: () => (
        <form className="ui form">
          <textarea
            placeholder="Remarks..."
            rows="1"
            className={styles.remarks}
          ></textarea>
        </form>
      ),
    },
  ];
  const handleEmpSubmit=()=>{
    if(name!='' && salary>0 && date!='' && !nameError)
    {
      if (localStorage.getItem("accessToken") == undefined)
          router.replace("/login");
      else {
        let obj = {};
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
            let obj={
              userid:datarec.userid,
              data:{
              name:name,
              salary:salary,
            attendance:{
              date:date,
              present:false,
              absent:false,
              advance:0,
              remarks:''
            }
            }
          }
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
              })
              .catch((err) => {
                console.log(err.message);
              });
          } else {
            localStorage.removeItem("accessToken");
            router.replace("/login");
          }
        })
        .catch((err) => {
          console.log(err.message);
          if (
            err.message.includes("jwt expired") ||
            err.message.includes("jwt malformed")
          ) {
            localStorage.removeItem("accessToken");
            router.replace("/login");
          }
          // localStorage.removeItem('accessToken');
          // router.replace("/login");
        });
    }
    }
  }
  const ExpandedComponent = ({ data }) => {
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
  };
  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>Create Next App</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
          <h1 className={styles.heading}>Attendance Management System</h1>
          <div>
            <Button
              content={dateFormat(startDate, "dddd, mmmm dS, yyyy")}
              secondary
              onClick={handleClick}
            />
            {isOpen && (
              <DatePicker
                todayButton="Today"
                selected={startDate}
                onChange={handleChange}
                inline
              />
            )}
          </div>
          <DataTable
            title={
              <Popup
                content="Add an employee"
                trigger={
                  <i
                    className={`user plus icon ${styles.addUser}`}
                    onClick={() => setOpen((prev) => !prev)}
                  ></i>
                }
              />
            }
            columns={columns}
            data={data}
            highlightDates={[pre]}
            // highlightOnHover
            // pointerOnHover
            pagination
            selectableRows
            expandableRows
            expandableRowsComponent={ExpandedComponent}
            contextActions={contextActions}
            onSelectedRowsChange={handleRowSelected}
            clearSelectedRows={toggleCleared}
          />
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
                error={nameError && "Avoid using numbers and specials characters except(,.'-)"}
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
                  onChange={(e)=>setsalary(e.target.value)}
                />
                <Form.Input
                  required
                  width={10}
                  fluid
                  label="Start Date"
                  type="date"
                  value={date}
                  onChange={(e)=>setdate(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color="red" onClick={() => setOpen(false)}>
              <Icon name="remove" /> Cancel
            </Button>
            <Button color="green" onClick={() => setOpen(false)} disabled={addEmp} onClick={handleEmpSubmit}>
              <Icon name="checkmark" /> Add
            </Button>
          </Modal.Actions>
        </Modal>
      }
    </>
  );
}
