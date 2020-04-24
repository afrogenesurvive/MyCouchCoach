import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
// import Accordion from 'react-bootstrap/Accordion';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import LessonSessionList from './LessonList/LessonSessionList';
import LessonScheduleList from './LessonList/LessonScheduleList';
import CreateLessonSessionForm from '../Forms/lesson/CreateLessonSessionForm';
import UpdateLessonBasicForm from '../Forms/lesson/UpdateLessonBasicForm';
import UpdateLessonFieldForm from '../Forms/lesson/UpdateLessonFieldForm';


// import AuthContext from '../../context/auth-context';

import './UserDetail.css';

const LessonDetail = (props) => {

  const {...lesson} = props.lesson;
  // let userDob = new Date(user.dob.substr(0,9) * 1000).toLocaleDateString().slice(0,10);
  const instructorIds = lesson.instructors.map(x => x._id)
  const isInstructor = instructorIds.includes(props.authId);
  return (
    <div className={"UserDetailBox1"}>

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

          </Col>

        </Row>

        <Row className="detailCardRow">

        <Col className="detailCardCol">
        Sessions:
        <Button variant="primary" onClick={props.onSessionLoad.bind(this, lesson._id)}>
          See Sessions
        </Button>
        <Button variant="danger" onClick={props.onHideSessions}>
          x
        </Button>
        {props.sessionsLoaded === true && (
          <LessonSessionList
          lessonSessions={lesson.sessions}
          onBookSession={props.onBookSession}
          onAddCartLesson={props.onAddCartLesson}
          showSessionBooked={props.showSessionBooked}
          showSessionAttended={props.showSessionAttended}
          hideSessionBooked={props.hideSessionBooked}
          hideSessionAttended={props.hideSessionAttended}
          sessionBookedState={props.sessionBookedState}
          sessionAttendedState={props.sessionAttendedState}
        />
      )}
        </Col>

          {isInstructor === true && (
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
        )}

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

            <Button variant="danger" onClick={props.onHideLessonDetail}>
              x
            </Button>
            { props.canDelete === true && (
              <Button variant="danger" onClick={props.onDelete.bind(this, lesson._id)}>
                Delete !!??
              </Button>
            )}
            { props.canReport === true && (
              <Button variant="danger" onClick={props.onReport.bind(this, lesson._id)}>
                Report!!??
              </Button>
            )}
          </Col>
          </Row>


      </Card.Body>
      </Card>
      </Tab>

    </Tabs>

    </div>

  );
}

export default LessonDetail;
