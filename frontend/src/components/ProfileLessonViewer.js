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
import LessonInstructorList from './Lessons/LessonList/LessonInstructorList';
import LessonRequirementList from './Lessons/LessonList/LessonRequirementList';
import LessonMaterialList from './Lessons/LessonList/LessonMaterialList';
import LessonReviewList from './Lessons/LessonList/LessonReviewList';
import CreateLessonSessionForm from './Forms/lesson/CreateLessonSessionForm';
import UpdateLessonBasicForm from './Forms/lesson/UpdateLessonBasicForm';
import UpdateLessonFieldForm from './Forms/lesson/UpdateLessonFieldForm';
import UpdateSessionFieldForm from './Forms/lesson/UpdateSessionFieldForm';

// import AuthContext from '../../context/auth-context';

import './AttachmentViewer.css';

const ProfileLessonViewer = (props) => {

  const {...lesson} = props.profileLesson;
  const instructorIds = lesson.instructors.map(x => x._id)
  const isInstructor = instructorIds.includes(props.authId);
  console.log(lesson.sessions);
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
          </Card.Text>

          <Card.Text>
          ID: {lesson.instructors[0]._id}
          </Card.Text>
          <Card.Text>
          Username: {lesson.instructors[0].username}
          </Card.Text>
          <Card.Text>
            Contact
          </Card.Text>
          <Card.Text>
            Email: {lesson.instructors[0].contact.email}
          </Card.Text>

          </Col>
        </Row>

        <Row>
          <Col>
          <Card.Text>
          Instructors
          </Card.Text>
            <Button variant="danger" onClick={props.toggleInstructors}>
              Show/Hide
            </Button>
            {props.showInstructorsState === true && (
              <LessonInstructorList
                lessonInstructors={lesson.instructors}
              />
            )}
          </Col>
        </Row>

        <Row>
          <Col>
          <Card.Text>
          Schedule
          </Card.Text>
          <Button variant="danger" onClick={props.toggleSchedule}>
            show/hide
          </Button>
          {props.showScheduleState === true && (
            <LessonScheduleList
              lessonSchedule={lesson.schedule}
            />
          )}
          </Col>
        </Row>

        <Row>
          <Col>
          <Card.Text>
          Requirements
          </Card.Text>
            <Button variant="danger" onClick={props.toggleRequirements}>
              Show/Hide
            </Button>
            {props.showRequirementsState === true && (
              <LessonRequirementList
                lessonRequirements={lesson.requirements}
              />
            )}
          </Col>
        </Row>


        <Row>
          <Col>
          <Card.Text>
          Materials
          </Card.Text>
            <Button variant="danger" onClick={props.toggleMaterials}>
              Show/Hide
            </Button>
            {props.showMaterialsState === true && (
              <LessonMaterialList
                lessonMaterials={lesson.materials}
              />
            )}
          </Col>
        </Row>

        <Row>
          <Col>
          <Card.Text>
          Reviews
          </Card.Text>
            <Button variant="danger" onClick={props.toggleReviews}>
              Show/Hide
            </Button>
            {props.showReviewsState === true && (
              <LessonReviewList
                lessonReviews={lesson.reviews}
              />
            )}
          </Col>
        </Row>

        <Row className="detailCardRow">
          <Col className="detailCardCol">
            <Button variant="danger" onClick={props.closeProfileLessonView}>
              x
            </Button>
          </Col>
        </Row>


          <Row className="detailCardRow">

          <Col>
          <p>Sessions:</p>

          <Button variant="primary" onClick={props.toggleSessions}>
            Show/Hide
          </Button>
          {lesson.sessions !== [] &&
            props.showSessionState === true && (
            <LessonSessionList
            isInstructor={isInstructor}
            lessonSessions={lesson.sessions}
            editSessionField={props.startEditSessionField}
            showSessionBooked={props.showSessionBooked}
            showSessionAttended={props.showSessionAttended}
            hideSessionBooked={props.hideSessionBooked}
            hideSessionAttended={props.hideSessionAttended}
            sessionBookedState={props.sessionBookedState}
            sessionAttendedState={props.sessionAttendedState}
            addSessionAttendance={props.addSessionAttendance}
            />
          )}
          </Col>


          {isInstructor === true && (

          <Col className="detailCardCol">
          {props.editingSessionField === true && (
            <UpdateSessionFieldForm
              authId={props.authId}
              session={props.session}
              onConfirm={props.editSessionField}
              onCancel={props.cancelEditSessionField}
            />
          )}

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

      </Card.Body>
      </Card>
      </Tab>

    </Tabs>

    </div>
    </div>

  );
}

export default ProfileLessonViewer;
