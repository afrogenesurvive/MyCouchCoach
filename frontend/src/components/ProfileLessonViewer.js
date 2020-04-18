import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
// import Accordion from 'react-bootstrap/Accordion';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import LessonSessionList from './Lessons/LessonList/LessonSessionList';
import LessonScheduleList from './Lessons/LessonList/LessonScheduleList';
import CreateLessonSessionForm from './Forms/lesson/CreateLessonSessionForm';
import UpdateLessonBasicForm from './Forms/lesson/UpdateLessonBasicForm';
import UpdateLessonFieldForm from './Forms/lesson/UpdateLessonFieldForm';


// import AuthContext from '../../context/auth-context';

import './AttachmentViewer.css';

const ProfileLessonViewer = (props) => {

  const {...lesson} = props.profileLesson;
  // let userDob = new Date(user.dob.substr(0,9) * 1000).toISOString().slice(0,10);
  const instructorIds = lesson.instructors.map(x => x._id)
  const isInstructor = instructorIds.includes(props.authId);
  // console.log(lesson.sessions);
  return (
    <div className="attachmentViewerBg">
      <div className="attachmentViewer">

    <Tabs defaultActiveKey="Basic" id="uncontrolled-tab-example" className="tab">

      <Tab eventKey="Basic" title="Basic">
      <Card className="UserDetailCard">
      <Card.Body>
        <Card.Title><span className="ul">Lesson Details</span></Card.Title>
        <Row className="detailCardRow">
          <Col className="detailCardCol">
          {isInstructor === true &&(
            <Card.Text>
            Your lesson
            </Card.Text>
          )}
          <Card.Text>
            <span className="bold">ID:</span> {lesson._id}
          </Card.Text>
          <Card.Text>
            <span className="bold">Title:</span> {lesson.title}
          </Card.Text>
          <Card.Text>
            <span className="bold">Subtitle:</span> {lesson.subtitle}
          </Card.Text>
          <Card.Text>
            <span className="bold">Type:</span> {lesson.type}
          </Card.Text>
          <Card.Text>
            <span className="bold">Category:</span> {lesson.category}
          </Card.Text>
          <Card.Text>
            <span className="bold">Sku:</span> {lesson.sku}
          </Card.Text>
          <Card.Text>
            <span className="bold">Price:</span> {lesson.price}
          </Card.Text>
          <Card.Text>
            <span className="bold">Description:</span> {lesson.description}
          </Card.Text>

          </Col>

          <Col className="detailCardCol">
          <Card.Text>
            <span className="bold">Main Instructor:</span>
            {lesson.instructors[0]._id}
            {lesson.instructors[0].username}
            {lesson.instructors[0].contact.phone}
            {lesson.instructors[0].contact.email}
          </Card.Text>

          </Col>
        </Row>

        {isInstructor === true && (
        <Row className="detailCardRow">
          <Col className="detailCardCol">

          <Button variant="danger" onClick={props.onStartEditLessonBasic}>
            Edit Basic
          </Button>
            {props.editingLesson === true && (
              <UpdateLessonBasicForm
              lesson={lesson}
              onCancel={props.cancelEditBasic}
              onConfirm={props.editLessonBasic}
              />
            )}
          </Col>
        </Row>
        )}
        {isInstructor === true && (
        <Row className="detailCardRow">
          <Col className="detailCardCol">
          <Button variant="danger" onClick={props.onStartEditLessonField}>
            Edit Field
          </Button>
            {props.editingLessonField === true && (
              <UpdateLessonFieldForm
              lesson={lesson}
              onCancel={props.cancelEditField}
              onConfirm={props.editLessonField}
              />
            )}
          </Col>
        </Row>
        )}

        <Row className="detailCardRow">
          <Col className="detailCardCol">
            <Button variant="danger" onClick={props.closeProfileLessonView}>
              x
            </Button>
          </Col>
        </Row>

        {isInstructor === true && (
          <Row className="detailCardRow">

          <Col className="detailCardCol">
          Schedule:
          <Button variant="danger" onClick={props.showSchedule}>
            See dates
          </Button>
          <Button variant="danger" onClick={props.hideSchedule}>
            Hide dates
          </Button>
          {props.showScheduleState === true && (
            <LessonScheduleList
              lessonSchedule={lesson.schedule}
            />
          )}

          Sessions:
          <Button variant="primary" onClick={props.showSessions}>
            Show Sessions
          </Button>
          <Button variant="primary" onClick={props.hideSessions}>
            X
          </Button>
          {lesson.sessions !== [] &&
            props.showSessionState === true && (
            <LessonSessionList
            lessonSessions={lesson.sessions}
            />
          )}
          </Col>

          <Col className="detailCardCol">
          <Button variant="primary" onClick={props.startCreateSession.bind(this, lesson._id)}>
            New Session
          </Button>
          {props.creatingSession === true && (
            <CreateLessonSessionForm
              authId={props.authId}
              onCancel={props.cancelCreateSession}
              onConfirm={props.createLessonSession}
            />
          )}
          </Col>

        </Row>
      )}

      </Card.Body>
      </Card>
      </Tab>

    </Tabs>

    </div>
    </div>

  );
}

export default ProfileLessonViewer;
