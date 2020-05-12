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
import LessonTagList from './Lessons/LessonList/LessonTagList';
import LessonImageList from './Lessons/LessonList/LessonImageList';
import LessonFileList from './Lessons/LessonList/LessonFileList';
import LessonReviewList from './Lessons/LessonList/LessonReviewList';
import CreateLessonSessionForm from './Forms/lesson/CreateLessonSessionForm';
import UpdateLessonBasicForm from './Forms/lesson/UpdateLessonBasicForm';
import UpdateLessonFieldForm from './Forms/lesson/UpdateLessonFieldForm';
import UpdateSessionFieldForm from './Forms/lesson/UpdateSessionFieldForm';

import AddLessonRequirementsForm from './Forms/lesson/AddLessonRequirementsForm';
import AddLessonMaterialsForm from './Forms/lesson/AddLessonMaterialsForm';
import AddLessonTagsForm from './Forms/lesson/AddLessonTagsForm';
import AddLessonImageForm from './Forms/lesson/AddLessonImageForm';
import AddLessonFileForm from './Forms/lesson/AddLessonFileForm';
import AddLessonInstructorForm from './Forms/lesson/AddLessonInstructorForm';

// import AuthContext from '../../context/auth-context';

import './AttachmentViewer.css';

const ProfileLessonViewer = (props) => {

  const lessonType = props.lessonType;
  const {...lesson} = props.profileLesson;
  const instructorIds = lesson.instructors.map(x => x._id)
  const isInstructor = instructorIds.includes(props.authId);
  // let canDelete = false;
  // if (isInstructor === true ) {
  //   canDelete = true
  // }
  console.log(lesson);
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
                <Button variant="danger" onClick={props.closeProfileLessonView}>
                  x
                </Button>
              </Col>
            </Row>


        </Card.Body>
        </Card>
        </Tab>

        <Tab eventKey="sessions" title="sessions">
        <Card className="UserDetailCard">
        <Card.Body>

        <Row className="detailCardRow">

          <Col>
          <p>Sessions:</p>

          {lesson.sessions !== [] && (
          <Button variant="primary" onClick={props.toggleSessions}>
            Show/Hide
          </Button>
          )}
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
            cancelSessionBooking={props.cancelSessionBooking}
            />
          )}
          </Col>


          {isInstructor === true &&
            lessonType === 'booked' && (

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
              {isInstructor === true && (
              <Button variant="danger" onClick={props.startLessonAdd.bind(this, 'requirements')}>
                Add
              </Button>
              )}
              {props.lessonAddField === 'requirements' && (
                <AddLessonRequirementsForm
                authId={props.authId}
                onCancel={props.cancelLessonAdd}
                onConfirm={props.addLessonRequirements}
                />
              )}
              {props.showRequirementsState === true && (
                <LessonRequirementList
                  lessonRequirements={lesson.requirements}
                  canDelete
                  onDelete={props.deleteLessonRequirement}
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
              {isInstructor === true && (
              <Button variant="danger" onClick={props.startLessonAdd.bind(this, 'materials')}>
                Add
              </Button>
              )}
              {props.lessonAddField === 'materials' && (
                <AddLessonMaterialsForm
                authId={props.authId}
                onCancel={props.cancelLessonAdd}
                onConfirm={props.addLessonMaterials}
                />
              )}
              {props.showMaterialsState === true && (
                <LessonMaterialList
                  lessonMaterials={lesson.materials}
                  canDelete
                  onDelete={props.deleteLessonMaterial}
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
              {isInstructor === true && (
              <Button variant="danger" onClick={props.startLessonAdd.bind(this, 'images')}>
                Add
              </Button>
              )}
              {props.lessonAddField === 'images' && (
                <AddLessonImageForm
                authId={props.authId}
                onCancel={props.cancelLessonAdd}
                onConfirm={props.addLessonImage}
                />
              )}
              {props.showImagesState === true && (
                <LessonImageList
                  lessonImages={lesson.gallery}
                  canDelete
                  onDelete={props.deleteLessonImage}
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
              {isInstructor === true &&  (
              <Button variant="danger" onClick={props.startLessonAdd.bind(this, 'files')}>
                Add
              </Button>
              )}
              {props.lessonAddField === 'files' && (
                <AddLessonFileForm
                authId={props.authId}
                onCancel={props.cancelLessonAdd}
                onConfirm={props.addLessonFile}
                />
              )}
              {props.showFilesState === true && (
                <LessonFileList
                  lessonFiles={lesson.files}
                  canDelete
                  onDelete={props.deleteLessonFile}
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
              {isInstructor === true &&
                JSON.stringify(props.selectedInstructor) === "{}" && (
              <Button variant="warning">
                Select an Instructor to Add
              </Button>
              )}
              {isInstructor === true &&
                JSON.stringify(props.selectedInstructor) !== "{}" && (
              <Button variant="danger" onClick={props.startLessonAdd.bind(this, 'instructors')}>
                Add
              </Button>
              )}
              {props.lessonAddField === 'instructors' &&  (
                <AddLessonInstructorForm
                selectedInstructor={props.selectedInstructor}
                authId={props.authId}
                onCancel={props.cancelLessonAdd}
                onConfirm={props.addLessonInstructor}
                />
              )}
              {props.showInstructorsState === true && (
                <LessonInstructorList
                  lessonInstructors={lesson.instructors}
                  canDelete
                  onDelete={props.deleteLessonInstructor}
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
            {isInstructor === true && (
            <Button variant="danger" onClick={props.startLessonAdd.bind(this, 'tags')}>
              Add
            </Button>
            )}
            {props.lessonAddField === 'tags' && (
              <AddLessonTagsForm
              authId={props.authId}
              onCancel={props.cancelLessonAdd}
              onConfirm={props.addLessonTags}
              />
            )}
            {props.showTagsState === true && (
              <LessonTagList
                lessonTags={lesson.tags}
                canDelete
                onDelete={props.deleteLessonTag}
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
      </div>

  );
}

export default ProfileLessonViewer;


//   <div className="attachmentViewerBg">
//   <div className="attachmentViewer">
//
// <Tabs defaultActiveKey="Basic" id="uncontrolled-tab-example" className="tab">
//
//   <Tab eventKey="Basic" title="Basic">
//   <Card className="UserDetailCard">
//   <Card.Body>
//     <Card.Title><span className="ul">Lesson Details</span></Card.Title>
//     <Row className="detailCardRow">
//       <Col className="detailCardCol">
//       {isInstructor === true &&(
//         <Card.Text>
//         Your lesson
//         </Card.Text>
//       )}
//       <Card.Text>
//         <span className="bold">ID:</span> {lesson._id}
//       </Card.Text>
//       <Card.Text>
//         <span className="bold">Title:</span> {lesson.title}
//       </Card.Text>
//       <Card.Text>
//         <span className="bold">Subtitle:</span> {lesson.subtitle}
//       </Card.Text>
//       <Card.Text>
//         <span className="bold">Type:</span> {lesson.type}
//       </Card.Text>
//       <Card.Text>
//         <span className="bold">Category:</span> {lesson.category}
//       </Card.Text>
//       <Card.Text>
//         <span className="bold">Sku:</span> {lesson.sku}
//       </Card.Text>
//       <Card.Text>
//         <span className="bold">Price:</span> {lesson.price}
//       </Card.Text>
//       <Card.Text>
//         <span className="bold">Description:</span> {lesson.description}
//       </Card.Text>
//
//       </Col>
//
//       <Col className="detailCardCol">
//       <Card.Text>
//         <span className="bold">Main Instructor:</span>
//       </Card.Text>
//
//       <Card.Text>
//       ID: {lesson.instructors[0]._id}
//       </Card.Text>
//       <Card.Text>
//       Username: {lesson.instructors[0].username}
//       </Card.Text>
//       <Card.Text>
//         Contact
//       </Card.Text>
//       <Card.Text>
//         Email: {lesson.instructors[0].contact.email}
//       </Card.Text>
//
//       </Col>
//     </Row>
//
//     <Row>
//       <Col>
//       <Card.Text>
//       Instructors
//       </Card.Text>
//         <Button variant="danger" onClick={props.toggleInstructors}>
//           Show/Hide
//         </Button>
//         {props.showInstructorsState === true && (
//           <LessonInstructorList
//             lessonInstructors={lesson.instructors}
//           />
//         )}
//       </Col>
//     </Row>
//
//     <Row>
//       <Col>
//       <Card.Text>
//       Schedule
//       </Card.Text>
//       <Button variant="danger" onClick={props.toggleSchedule}>
//         show/hide
//       </Button>
//       {props.showScheduleState === true && (
//         <LessonScheduleList
//           lessonSchedule={lesson.schedule}
//         />
//       )}
//       </Col>
//     </Row>
//
//     <Row>
//       <Col>
//       <Card.Text>
//       Requirements
//       </Card.Text>
//         <Button variant="danger" onClick={props.toggleRequirements}>
//           Show/Hide
//         </Button>
//         {props.showRequirementsState === true && (
//           <LessonRequirementList
//             lessonRequirements={lesson.requirements}
//           />
//         )}
//       </Col>
//     </Row>
//
//
//     <Row>
//       <Col>
//       <Card.Text>
//       Materials
//       </Card.Text>
//         <Button variant="danger" onClick={props.toggleMaterials}>
//           Show/Hide
//         </Button>
//         {props.showMaterialsState === true && (
//           <LessonMaterialList
//             lessonMaterials={lesson.materials}
//           />
//         )}
//       </Col>
//     </Row>
//
//     <Row>
//       <Col>
//       <Card.Text>
//       Reviews
//       </Card.Text>
//         <Button variant="danger" onClick={props.toggleReviews}>
//           Show/Hide
//         </Button>
//         {props.showReviewsState === true && (
//           <LessonReviewList
//             lessonReviews={lesson.reviews}
//           />
//         )}
//       </Col>
//     </Row>
//
//     <Row className="detailCardRow">
//       <Col className="detailCardCol">
//         <Button variant="danger" onClick={props.closeProfileLessonView}>
//           x
//         </Button>
//       </Col>
//     </Row>
//
//
// <Row className="detailCardRow">
//
//   <Col>
//   <p>Sessions:</p>
//
//   <Button variant="primary" onClick={props.toggleSessions}>
//     Show/Hide
//   </Button>
//   {lesson.sessions !== [] &&
//     props.showSessionState === true && (
//     <LessonSessionList
//     isInstructor={isInstructor}
//     lessonSessions={lesson.sessions}
//     editSessionField={props.startEditSessionField}
//     showSessionBooked={props.showSessionBooked}
//     showSessionAttended={props.showSessionAttended}
//     hideSessionBooked={props.hideSessionBooked}
//     hideSessionAttended={props.hideSessionAttended}
//     sessionBookedState={props.sessionBookedState}
//     sessionAttendedState={props.sessionAttendedState}
//     addSessionAttendance={props.addSessionAttendance}
//     />
//   )}
//   </Col>
//
//
//   {isInstructor === true && (
//
//   <Col className="detailCardCol">
//   {props.editingSessionField === true && (
//     <UpdateSessionFieldForm
//       authId={props.authId}
//       session={props.session}
//       onConfirm={props.editSessionField}
//       onCancel={props.cancelEditSessionField}
//     />
//   )}
//
//   <Button variant="primary" onClick={props.startCreateSession.bind(this, lesson._id)}>
//     New Session
//   </Button>
//   {props.creatingSession === true && (
//     <CreateLessonSessionForm
//       authId={props.authId}
//       onCancel={props.cancelCreateSession}
//       onConfirm={props.createLessonSession}
//     />
//   )}
//   </Col>
//
//   )}
//
// </Row>
//
//     {isInstructor === true && (
//     <Row className="detailCardRow">
//       <Col className="detailCardCol">
//
//       <Button variant="danger" onClick={props.onStartEditLessonBasic}>
//         Edit Basic
//       </Button>
//         {props.editingLesson === true && (
//           <UpdateLessonBasicForm
//           lesson={lesson}
//           onCancel={props.cancelEditBasic}
//           onConfirm={props.editLessonBasic}
//           />
//         )}
//       </Col>
//     </Row>
//     )}
//
//     {isInstructor === true && (
//     <Row className="detailCardRow">
//       <Col className="detailCardCol">
//       <Button variant="danger" onClick={props.onStartEditLessonField}>
//         Edit Field
//       </Button>
//         {props.editingLessonField === true && (
//           <UpdateLessonFieldForm
//           lesson={lesson}
//           onCancel={props.cancelEditField}
//           onConfirm={props.editLessonField}
//           />
//         )}
//       </Col>
//     </Row>
//     )}
//
//   </Card.Body>
//   </Card>
//   </Tab>
//
// </Tabs>
//
// </div>
// </div>
