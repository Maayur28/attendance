import DataTable from "react-data-table-component";
import DatePicker from "react-datepicker";
import styles from "../styles/Home.module.css";
import "semantic-ui-css/semantic.min.css";
import "react-datepicker/dist/react-datepicker.css";
import { Popup, Button, Modal, Icon, Form } from "semantic-ui-react";
import { useState } from "react";
import dateFormat from "dateformat";
 
 export default function Attendance() {
 const [check, setcheck] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const pre = new Date();
  const handleChange = (e) => {
    setIsOpen(!isOpen);
    setStartDate(e);
  };
  const handleClick = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
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
  const data = [
    {
      id: 1,
      name: "Mayur",
      director: "abc",
      year: "1988",
    },
    {
      id: 2,
      name: "Agarwal",
      director: "xyz",
      year: "1984",
    },
  ];
  return (
    <>
      <div className={styles.container}>
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
                error="Please enter name"
                fluid
                label="Name"
                placeholder="Name"
                id="form-input-name"
              />
              <Form.Group>
                <Form.Input
                  required
                  error="Please enter salary"
                  fluid
                  width={6}
                  label="Salary"
                  placeholder="Salary/day"
                  type="number"
                />
                <Form.Input
                  required
                  width={10}
                  error="Please enter start date"
                  fluid
                  label="Start Date"
                  type="date"
                />
              </Form.Group>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color="red" onClick={() => setOpen(false)}>
              <Icon name="remove" /> Cancel
            </Button>
            <Button color="green" onClick={() => setOpen(false)}>
              <Icon name="checkmark" /> Add
            </Button>
          </Modal.Actions>
        </Modal>
      }
    </>
  );
 }