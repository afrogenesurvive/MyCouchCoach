import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
// import Accordion from 'react-bootstrap/Accordion';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './CreateUserForm.css';

const RepeatLessonSessionForm = (props) => {
  const {...session} = props.session;

  const [date, setDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

    const handleChangeDate = date => {
      setDate(date);
      // console.log(`date ${date}`);
     }
    const handleChangeEndDate = endDate => {
      setEndDate(endDate);
      // console.log(`endDate ${endDate}`);
     }

return (
<div className="CreateFormContainer">
<Form onSubmit={props.onConfirm}>

<Form.Row>
  <Form.Group as={Col} controlId="formGridTitle">
    <Form.Label>Title</Form.Label>
    <Form.Control type="text" value={session.title}/>
  </Form.Group>
</Form.Row>

<Form.Row>
<Form.Group as={Col} controlId="">
  <Form.Label>Session Date</Form.Label>
  <DatePicker className="" id="CalendarDate"
    selected={date}
    onChange={handleChangeDate}
  />
</Form.Group>
</Form.Row>

{props.lessonSubType &&
  props.lessonSubType === 'MultiDay' && (
<Form.Row>
<Form.Group as={Col} controlId="">
  <Form.Label>Session EndDate</Form.Label>
  <DatePicker className="" id="CalendarEndDate"
    selected={endDate}
    onChange={handleChangeEndDate}
  />
</Form.Group>
</Form.Row>
)}

<Form.Row>
<Form.Group as={Col} controlId="formGridTime">
  <Form.Label>Time</Form.Label>
  <Form.Control type="text" value={session.time}/>
</Form.Group>

<Form.Group as={Col} controlId="formGridLimit">
  <Form.Label>Limit</Form.Label>
  <Form.Control type="text" value={session.limit}/>
</Form.Group>
</Form.Row>

<Form.Row>

<Button variant="danger" className="formButton" onClick={props.onCancel}>Cancel</Button>

<Button variant="primary" className="formButton" type="submit">
  Create
</Button>
</Form.Row>


</Form>
</div>

)};

export default RepeatLessonSessionForm;
