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
import LessonInstructorList from './LessonList/LessonInstructorList';
import LessonRequirementList from './LessonList/LessonRequirementList';
import LessonMaterialList from './LessonList/LessonMaterialList';
import LessonReviewList from './LessonList/LessonReviewList';
import CreateLessonSessionForm from '../Forms/lesson/CreateLessonSessionForm';
import UpdateLessonBasicForm from '../Forms/lesson/UpdateLessonBasicForm';
import UpdateLessonFieldForm from '../Forms/lesson/UpdateLessonFieldForm';


// import AuthContext from '../../context/auth-context';

import './UserDetail.css';

const LessonDetail = (props) => {

  const {...lesson} = props.lesson;

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

        <Row className="detailCardRow">

        <Col className="detailCardCol">
        <Card.Text>
        Sessions:
        </Card.Text>
        <Button variant="primary" onClick={props.onSessionLoad.bind(this, lesson._id)}>
          See Sessions
        </Button>
        <Button variant="danger" onClick={props.onHideSessions}>
          x
        </Button>
        {props.sessionsLoaded === true && (
          <LessonSessionList
          isInstructor={isInstructor}
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

          {isInstructor === true && (
          <Button variant="primary" onClick={props.startCreateSession.bind(this, lesson._id)}>
            New Session
          </Button>
          )}
          {props.creatingSession === true &&
            isInstructor === true && (
            <CreateLessonSessionForm
              authId={props.authId}
              onCancel={props.cancelCreateSession}
              onConfirm={props.createLessonSession}
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
