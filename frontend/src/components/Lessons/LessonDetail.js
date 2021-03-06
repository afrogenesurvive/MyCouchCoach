// import React from 'react';
import React, {useState} from 'react';
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

import AddLessonRequirementsForm from '../Forms/lesson/AddLessonRequirementsForm';
import AddLessonMaterialsForm from '../Forms/lesson/AddLessonMaterialsForm';
import AddLessonTagsForm from '../Forms/lesson/AddLessonTagsForm';
import AddLessonImageForm from '../Forms/lesson/AddLessonImageForm';
import AddLessonFileForm from '../Forms/lesson/AddLessonFileForm';
import AddLessonInstructorForm from '../Forms/lesson/AddLessonInstructorForm';

import SessionDetailViewer from '../SessionDetailViewer';
// import BigCalendar from 'react-big-calendar';
// import moment from 'moment';
// import AuthContext from '../../context/auth-context';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import '../../calendar.scss'

import './UserDetail.css';

const LessonDetail = (props) => {

  const {...lesson} = props.lesson;
  const {...user} = props.user;

  let userLikedLessons = [];
  let hasLiked = false;
  if (user.likedLessons !== []) {
    userLikedLessons = user.likedLessons.map(x => x._id);
    hasLiked = userLikedLessons.includes(lesson._id.toString());
  }

  const instructorIds = lesson.instructors.map(x => x._id)
  const isInstructor = instructorIds.includes(props.authId);
  let canDelete = false;
  if (isInstructor === true ) {
    canDelete = true
  }

  let lessonCalendarSessions = [];
  if (lesson.sessions) {
    lessonCalendarSessions = lesson.sessions.map(x => ({
      title: x.title,
      date: new Date (x.date.substr(0,10)*1000).toISOString().slice(0,10),
      end: new Date (x.endDate.substr(0,10)*1000).toISOString().slice(0,10),
      props: {
        title: x.title,
        date: new Date (x.date.substr(0,10)*1000).toISOString().slice(0,10),
        endDate: new Date (x.endDate.substr(0,10)*1000).toISOString().slice(0,10),
        lessonId: lesson._id,
        lessonTitle: lesson.title,
        lessonInstructors: lesson.instructors,
        time: x.time,
        limit: x.limit,
        amount: x.amount,
        booked: x.booked,
        bookedAmount: x.bookedAmount,
        attended: x.attended,
        attendedAmount: x.attendedAmount,
        inProgress: x.inProgress,
        full: x.full,
        url: x.url,
      }
    }))
  }
  // const lessonCalendarSessions = lesson.sessions.map(x => new Date (x.date.substr(0,10)*1000).toLocaleDateString().slice(0,10))
  // console.log(...lessonCalendarSessions);
  const [calEvent, clickEvent] = useState();
  const handleEventClick = calEvent => {
    // calEvent.preventDefault();
    // console.log(calEvent.event);
  }
  // console.log(props.sessionDetailViewer);
  // console.log('lesson.gallery',lesson.gallery);

  return (
    <div className={"UserDetailBox1"}>
    <Row>
    <Button variant="danger" onClick={props.onHideLessonDetail}>
      x
    </Button>
    </Row>

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
            <span className="bold">Public:</span> {lesson.public.toString()}
          </Card.Text>
          <Card.Text>
            <span className="bold">Type:</span> {lesson.type}
          </Card.Text>
          <Card.Text>
            <span className="bold">SubType:</span> {lesson.subType}
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
            <Row>
              <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'lessonDetail', key: 'schedule', value: 'dateAscending'})}>
                Filter Date: Ascending
              </Button>
              <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'lessonDetail', key: 'schedule', value: 'dateDescending'})}>
                Filter Date: Descending
              </Button>
              <Button variant="danger" onClick={props.setFilter.bind(this, {field: null, key: null, value: null })}>
                clearFilter
              </Button>
            </Row>
          )}

          {props.showScheduleState === true && (
            <LessonScheduleList
              lessonSchedule={lesson.schedule}
              filter={props.filter}
            />
          )}
          </Col>
        </Row>

        <Row className="detailCardRow">
          <Col className="detailCardCol">



            {hasLiked !== true && (
            <Button variant="danger" onClick={props.onLikeLesson.bind(this, lesson._id)}>
              Like
            </Button>
            )}

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

      {
        // events={lessonCalendarSessions}
        // events={[
        //   { title: 'event 1', date: '2020-05-01', foo: true, bar: 'toast',baz:'roast' },
        //   { title: 'event 2', date: '2020-04-02', foo: true, bar: 'toast',baz:'roast' }
        // ]}
        // eventClick={props.viewCalendarSessionDetail}
        // eventClick={handleEventClick}

        // <SessionDetailViewer
        // authId={props.authId}
        // session={props.session}
        // startEditSessionField={props.startEditSessionField}
        // cancelEditSessionField={props.cancelEditSessionField}
        // editingSessionField={props.editingSessionField}
        // editSessionField={props.editSessionField}
        // showSessionBooked={props.showSessionBooked}
        // showSessionAttended={props.showSessionAttended}
        // hideSessionBooked={props.hideSessionBooked}
        // hideSessionAttended={props.hideSessionAttended}
        // sessionBookedState={props.sessionBookedState}
        // sessionAttendedState={props.sessionAttendedState}
        // hideSessionDetails={props.hideSessionDetails}
        // addSessionAttendance={props.addSessionAttendance}
        // />
      }

      {props.sessionDetailViewer === true && (
        <SessionDetailViewer
        calendar
        lesson={lesson}
        authId={props.authId}
        session={props.calendarSession}
        hideCalendarSessionDetail={props.hideCalendarSessionDetail}
        onBookSession={props.onBookSession}
        onAddCartLesson={props.onAddCartLesson}
        />
      )}

      <Row className="detailCardRow">

        <Col className="detailCardCol">
        <Card.Text>
        Sessions:
        </Card.Text>
        {lesson.sessions !== [] && (
        <Button variant="primary" onClick={props.toggleSessions.bind(this, lesson._id)}>
          Show/Hide
        </Button>
        )}

        {
        //   isInstructor === true && (
        // <Button variant="primary" onClick={props.startCreateSession.bind(this, lesson._id)}>
        //   New Session
        // </Button>
        // )
      }

        {props.creatingSession === true &&
          isInstructor === true && (
          <CreateLessonSessionForm
            authId={props.authId}
            onCancel={props.cancelCreateSession}
            onConfirm={props.createLessonSession}
            lessonSubType={lesson.subType}
          />
        )}

        {props.sessionsLoaded === true && (
          <FullCalendar
          defaultView="dayGridMonth"
          plugins={[dayGridPlugin]}
          events={lessonCalendarSessions}
          eventClick={props.viewCalendarSessionDetail}
          />
        )}

        {
        //   props.sessionsLoaded === true && (
        //   <LessonSessionList
        //     isInstructor={isInstructor}
        //     lessonSessions={lesson.sessions}
        //     onBookSession={props.onBookSession}
        //     onAddCartLesson={props.onAddCartLesson}
        //     showSessionBooked={props.showSessionBooked}
        //     showSessionAttended={props.showSessionAttended}
        //     hideSessionBooked={props.hideSessionBooked}
        //     hideSessionAttended={props.hideSessionAttended}
        //     sessionBookedState={props.sessionBookedState}
        //     sessionAttendedState={props.sessionAttendedState}
        //   />
        // )
      }
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

            {props.showRequirementsState === true && (
              <Row>
                <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'lessonDetail', key: 'requirements', value: 'Ascending'})}>
                  Filter Ascending
                </Button>
                <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'lessonDetail', key: 'requirements', value: 'Descending'})}>
                  Filter Descending
                </Button>
                <Button variant="danger" onClick={props.setFilter.bind(this, {field: null, key: null, value: null })}>
                  clearFilter
                </Button>
              </Row>
            )}

            {
            //   isInstructor === true && (
            // <Button variant="danger" onClick={props.startLessonAdd.bind(this, 'requirements')}>
            //   Add
            // </Button>
            // )
          }
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
                filter={props.filter}
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
              <Row>
                <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'lessonDetail', key: 'materials', value: 'Ascending'})}>
                  Filter Ascending
                </Button>
                <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'lessonDetail', key: 'materials', value: 'Descending'})}>
                  Filter Descending
                </Button>
                <Button variant="danger" onClick={props.setFilter.bind(this, {field: null, key: null, value: null })}>
                  clearFilter
                </Button>
              </Row>
            )}
            {
            //   isInstructor === true && (
            // <Button variant="danger" onClick={props.startLessonAdd.bind(this, 'materials')}>
            //   Add
            // </Button>
            // )
          }
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
                filter={props.filter}
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

            {
            //   isInstructor === true && (
            // <Button variant="danger" onClick={props.startLessonAdd.bind(this, 'images')}>
            //   Add
            // </Button>
            // )
            }
            {props.lessonAddField === 'images' && (
              <AddLessonImageForm
              authId={props.authId}
              onCancel={props.cancelLessonAdd}
              onConfirm={props.addLessonImage}
              />
            )}
            {props.showImagesState === true && (
            <Row>
              <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'lessonDetail', key: 'images', value: 'nameAscending'})}>
                Filter Name: Ascending
              </Button>
              <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'lessonDetail', key: 'images', value: 'nameDescending'})}>
                Filter Name: Descending
              </Button>
              <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'lessonDetail', key: 'images', value: 'publicTrue'})}>
                Filter Public: True
              </Button>
              <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'lessonDetail', key: 'images', value: 'publicFalse'})}>
                Filter Public: False
              </Button>
              <Button variant="danger" onClick={props.setFilter.bind(this, {field: null, key: null, value: null })}>
                clearFilter
              </Button>
            </Row>
            )}
            {props.showImagesState === true && (
              <LessonImageList
                lessonImages={lesson.gallery}
                canDelete
                onDelete={props.deleteLessonImage}
                filter={props.filter}
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
            {
            //   isInstructor === true &&
            //   JSON.stringify(props.selectedInstructor) !== "{}" && (
            // <Button variant="danger" onClick={props.startLessonAdd.bind(this, 'instructors')}>
            //   Add
            // </Button>
            // )
          }
            {props.lessonAddField === 'instructors' &&  (
              <AddLessonInstructorForm
              selectedInstructor={props.selectedInstructor}
              authId={props.authId}
              onCancel={props.cancelLessonAdd}
              onConfirm={props.addLessonInstructor}
              />
            )}
            {props.showInstructorsState === true && (
              <Row>
                <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'lessonDetail', key: 'instructors', value: 'nameAscending'})}>
                  Filter Name: Ascending
                </Button>
                <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'lessonDetail', key: 'instructors', value: 'nameDescending'})}>
                  Filter Name: Descending
                </Button>
                <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'lessonDetail', key: 'instructors', value: 'emailAscending'})}>
                  Filter Email: Ascending
                </Button>
                <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'lessonDetail', key: 'instructors', value: 'emailDescending'})}>
                  Filter Email: Descending
                </Button>
                <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'lessonDetail', key: 'instructors', value: 'socialPlatformAscending'})}>
                  Filter SocialMedia - Platform: Ascending
                </Button>
                <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'lessonDetail', key: 'instructors', value: 'socialPlatformDescending'})}>
                  Filter SocialMedia - Platform: Ascending
                </Button>
                <Button variant="danger" onClick={props.setFilter.bind(this, {field: null, key: null, value: null })}>
                  clearFilter
                </Button>
              </Row>
            )}
            {props.showInstructorsState === true && (
              <LessonInstructorList
              canDelete
              onDelete={props.deleteLessonInstructor}
                lessonInstructors={lesson.instructors}
                filter={props.filter}
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

          {
          //   isInstructor === true && (
          // <Button variant="danger" onClick={props.startLessonAdd.bind(this, 'tags')}>
          //   Add
          // </Button>
          // )
        }
          {props.lessonAddField === 'tags' && (
            <AddLessonTagsForm
            authId={props.authId}
            onCancel={props.cancelLessonAdd}
            onConfirm={props.addLessonTags}
            />
          )}
          {props.showTagsState === true && (
          <Row>
            <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'lessonDetail', key: 'tags', value: 'Ascending'})}>
              Filter Ascending
            </Button>
            <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'lessonDetail', key: 'tags', value: 'Descending'})}>
              Filter Descending
            </Button>
            <Button variant="danger" onClick={props.setFilter.bind(this, {field: null, key: null, value: null })}>
              clearFilter
            </Button>
          </Row>
          )}
          {props.showTagsState === true && (
            <LessonTagList
              lessonTags={lesson.tags}
              canDelete
              onDelete={props.deleteLessonTag}
              filter={props.filter}
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
                filter={props.filter}
              />
            )}
          </Col>
        </Row>

      </Card.Body>
      </Card>
      </Tab>

      {
        // <Tab eventKey="files" title="files">
        // <Card className="UserDetailCard">
        // <Card.Body>
        //
        //   <Row>
        //     <Col>
        //     <Card.Text>
        //     Files
        //     </Card.Text>
        //       <Button variant="danger" onClick={props.toggleFiles}>
        //         Show/Hide
        //       </Button>
        //       {isInstructor === true && (
        //       <Button variant="danger" onClick={props.startLessonAdd.bind(this, 'files')}>
        //         Add
        //       </Button>
        //       )}
        //       {props.lessonAddField === 'files' && (
        //         <AddLessonFileForm
        //         authId={props.authId}
        //         onCancel={props.cancelLessonAdd}
        //         onConfirm={props.addLessonFile}
        //         />
        //       )}
        //       {props.showFilesState === true && (
        //         <LessonFileList
        //           lessonFiles={lesson.files}
        //           canDelete
        //           onDelete={props.deleteLessonFile}
        //         />
        //       )}
        //     </Col>
        //   </Row>
        //
        // </Card.Body>
        // </Card>
        // </Tab>

        // <Tab eventKey="edit" title="edit">
        // <Card className="UserDetailCard">
        // <Card.Body>
        //
        //     {isInstructor === true && (
        //         <Row className="detailCardRow">
        //         <Col className="detailCardCol">
        //         <Button variant="danger" onClick={props.onStartEditLessonBasic}>
        //           Edit Basic
        //         </Button>
        //           {props.editingLesson === true && (
        //             <UpdateLessonBasicForm
        //             lesson={lesson}
        //             onCancel={props.cancelEditBasic}
        //             onConfirm={props.editLessonBasic}
        //             />
        //           )}
        //         </Col>
        //
        //       </Row>
        //     )}
        //
        //       {isInstructor === true && (
        //         <Row className="detailCardRow">
        //         <Col className="detailCardCol">
        //         <Button variant="danger" onClick={props.onStartEditLessonField}>
        //           Edit Field
        //         </Button>
        //           {props.editingLessonField === true && (
        //             <UpdateLessonFieldForm
        //             lesson={lesson}
        //             onCancel={props.cancelEditField}
        //             onConfirm={props.editLessonField}
        //             />
        //           )}
        //         </Col>
        //
        //       </Row>
        //     )}
        //
        // </Card.Body>
        // </Card>
        // </Tab>
      }


    </Tabs>

    </div>

  );
}

export default LessonDetail;
