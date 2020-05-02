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
import LessonTagList from './LessonList/LessonTagList';
import LessonImageList from './LessonList/LessonImageList';
import LessonFileList from './LessonList/LessonFileList';
import LessonReviewList from './LessonList/LessonReviewList';
import CreateLessonSessionForm from '../Forms/lesson/CreateLessonSessionForm';
import UpdateLessonBasicForm from '../Forms/lesson/UpdateLessonBasicForm';
import UpdateLessonFieldForm from '../Forms/lesson/UpdateLessonFieldForm';


// import AuthContext from '../../context/auth-context';

import './UserDetail.css';

const LessonDetail = (props) => {

  const {...lesson} = props.lesson;
  console.log('beep',lesson.files);
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

        <Row className="detailCardRow">
          <Col className="detailCardCol">

            <Button variant="danger" onClick={props.onHideLessonDetail}>
              x
            </Button>

            <Button variant="danger" onClick={props.onLikeLesson.bind(this, lesson._id)}>
              Like
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

      <Tab eventKey="sessions" title="sessions">
      <Card className="UserDetailCard">
      <Card.Body>

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

      </Card.Body>
      </Card>
      </Tab>

      <Tab eventKey="materials/requirements" title="materials/requirements">
      <Card className="UserDetailCard">
      <Card.Body>

        <Row>
          <Col>
          <Card.Text>
          Requirements
          </Card.Text>
            <Button variant="danger" onClick={props.toggleRequirements}>
              Show/Hide
            </Button>
            <Button variant="danger" onClick={props.startLessonAdd.bind(this, 'requirements')}>
              Add
            </Button>
            {props.lessonAddField === 'requirements' && (
              <p>addLessonRequirementsForm</p>
              // cancelLessonAdd={props.cancelLessonAdd}
              // addLessonRequirements={props.addLessonRequirements}
            )}
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
            <Button variant="danger" onClick={props.startLessonAdd.bind(this, 'materials')}>
              Add
            </Button>
            {props.lessonAddField === 'materials' && (
              <p>addLessonMaterialsForm</p>
              // cancelLessonAdd={props.cancelLessonAdd}
              // addLessonMaterials={props.addLessonMaterials}
            )}
            {props.showMaterialsState === true && (
              <LessonMaterialList
                lessonMaterials={lesson.materials}
              />
            )}
          </Col>
        </Row>

      </Card.Body>
      </Card>
      </Tab>


      <Tab eventKey="images" title="images">
      <Card className="UserDetailCard">
      <Card.Body>

        <Row>
          <Col>
          <Card.Text>
          Images
          </Card.Text>
            <Button variant="danger" onClick={props.toggleImages}>
              Show/Hide
            </Button>
            <Button variant="danger" onClick={props.startLessonAdd.bind(this, 'images')}>
              Add
            </Button>
            {props.lessonAddField === 'images' && (
              <p>addLessonImagesForm</p>
              // cancelLessonAdd={props.cancelLessonAdd}
              // addLessonImages={props.addLessonImages}
            )}
            {props.showImagesState === true && (
              <LessonImageList
                lessonImages={lesson.gallery}
              />
            )}
          </Col>
        </Row>

      </Card.Body>
      </Card>
      </Tab>

      <Tab eventKey="files" title="files">
      <Card className="UserDetailCard">
      <Card.Body>

        <Row>
          <Col>
          <Card.Text>
          Files
          </Card.Text>
            <Button variant="danger" onClick={props.toggleFiles}>
              Show/Hide
            </Button>
            <Button variant="danger" onClick={props.startLessonAdd.bind(this, 'files')}>
              Add
            </Button>
            {props.lessonAddField === 'files' && (
              <p>addLessonFilesForm</p>
              // cancelLessonAdd={props.cancelLessonAdd}
              // addLessonFiles={props.addLessonFiles}
            )}
            {props.showFilesState === true && (
              <LessonFileList
                lessonFiles={lesson.files}
              />
            )}
          </Col>
        </Row>

      </Card.Body>
      </Card>
      </Tab>


      <Tab eventKey="instructors" title="instructors">
      <Card className="UserDetailCard">
      <Card.Body>

        <Row>
          <Col>
          <Card.Text>
          Instructors
          </Card.Text>
            <Button variant="danger" onClick={props.toggleInstructors}>
              Show/Hide
            </Button>
            <Button variant="danger" onClick={props.startLessonAdd.bind(this, 'instructors')}>
              Add
            </Button>
            {props.lessonAddField === 'instructors' && (
              <p>addLessonInstructorForm</p>
              // cancelLessonAdd={props.cancelLessonAdd}
              // addLessonInstructor={props.addLessonInstructor}
            )}
            {props.showInstructorsState === true && (
              <LessonInstructorList
                lessonInstructors={lesson.instructors}
              />
            )}
          </Col>
        </Row>

      </Card.Body>
      </Card>
      </Tab>

      <Tab eventKey="tags" title="tags">
      <Card className="UserDetailCard">
      <Card.Body>
      <Row>
        <Col>
        <Card.Text>
        Tags
        </Card.Text>
          <Button variant="danger" onClick={props.toggleTags}>
            Show/Hide
          </Button>
          <Button variant="danger" onClick={props.startLessonAdd.bind(this, 'tags')}>
            Add
          </Button>
          {props.lessonAddField === 'tags' && (
            <p>addLessonTagsForm</p>
            // cancelLessonAdd={props.cancelLessonAdd}
            // addLessonTags={props.addLessonTags}
          )}
          {props.showTagsState === true && (
            <LessonTagList
              lessonTags={lesson.tags}
            />
          )}
        </Col>
      </Row>

      </Card.Body>
      </Card>
      </Tab>

      <Tab eventKey="reviews" title="reviews">
      <Card className="UserDetailCard">
      <Card.Body>

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

      </Card.Body>
      </Card>
      </Tab>

      <Tab eventKey="edit" title="edit">
      <Card className="UserDetailCard">
      <Card.Body>

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

  );
}

export default LessonDetail;
