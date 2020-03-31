import S3 from 'react-aws-s3';
import React, { Component } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import Card from 'react-bootstrap/Card';

import AuthContext from '../../context/auth-context';
import LessonList from '../../components/Lessons/LessonList/LessonList';
import SearchLessonList from '../../components/Lessons/UserList/SearchLessonList';
import LessonDetail from '../../components/Lessons/LessonDetail';

import Spinner from '../../components/Spinner/Spinner';
import SidebarPage from '../Sidebar';
import SidebarControl from '../../components/SidebarControl';
import AlertBox from '../../components/AlertBox';
import LoadingOverlay from '../../components/LoadingOverlay';
import AttachmentViewer from '../../components/AttachmentViewer';
import LessonDetailViewer from '../../components/LessonDetailViewer';

import SearchLessonForm from '../../components/Forms/lesson/SearchLessonForm';
import CreateLessonForm from '../../components/Forms/lesson/CreateLessonForm';

import './Users.css';

class LessonsPage extends Component {
  state = {
    creating: false,
    updating: false,
    deleting: false,
    searching: false,
    user: null,
    users: [],
    lesson: null,
    lessons: [],
    searchLessons: [],
    isLoading: false,
    isSorting: false,
    selectedLesson: null,
    lessonUpdateField: null,
    lessonSearchField: null,
    lessonSearchQuery: null,
    canDelete: null,
    canReport: null,
    userAlert: null,
    overlay: false,
    overlayStatus: "test",
    file: null,
    showDetail: false,
    showAttachment: false,
    showThisAttachmentFile: null,
    showThisAttachmentType: null,
    sidebarShow: true,
    mCol1Size: 3,
    mCol2Size: 9,
  };
  isActive = true;

  static contextType = AuthContext;

  componentDidMount() {

    if (this.context.role === "Admin"){
      this.setState({canDelete: true})
    }

    if (this.context.selectedLesson) {
      this.setState({ selectedLesson: this.context.selectedLesson })
    }

    this.fetchLessons();
  }



  modalConfirmSearchHandler = (event) => {

    let activityId = this.context.activityId;
    const token = this.context.token;
    let field = null;
    let query = event.target.formBasicQuery.value;
    if (event.target.formBasicFieldSelect.value === "select") {
      field = event.target.formBasicField.value;
    } else {
      field = event.target.formBasicFieldSelect.value;
    }

    this.setState({
      userSearchField: field,
      userSearchQuery: query,
      searching: false,
      userAlert: "Searching for User..."
    })

    if (
      field.trim().length === 0 ||
      query.trim().length === 0
    ) {
      this.setState({userAlert: "blank fields detected!!!...Please try again..."})
      return;
    }

    const search = { field, query };
    const requestBody = {
      query: `

      `}

    fetch('http://localhost:7077/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const responseAlert = JSON.stringify(resData.data).slice(0,8);
        const searchLessons = resData.data.;
        this.setState({ searchUsers: searchLessons, userAlert: responseAlert})
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  }

  startCreateLesson = () => {
    this.setState({creating: true})
  }

  createLessonHandler = () => {
    this.setState({creating: false})
    let activityId = this.context.activityId;
    const token = this.context.token;


    const requestBody = {
      query: `

      `}

    fetch('http://localhost:7077/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const responseAlert = JSON.stringify(resData.data).slice(0,8);
        this.setState({ searchUsers: resData.data., userAlert: responseAlert})
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  }

  modalCancelHandler = () => {
    this.setState({ creating: false, updating: false, deleting: false, searching: false});
  };

  fetchLessons() {
    const activityId = this.context.activityId;
    this.setState({ isLoading: true, userAlert: "Fetching Lesson Master List..." });
    const requestBody = {
      query: `

        `};

    fetch('http://localhost:7077/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          this.setState({userAlert: 'Failed!'});
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const responseAlert = JSON.stringify(resData.data).slice(0,8);
        this.setState({userAlert: responseAlert, lessons: resData.data., isLoading: false});
        this.context.lessons = this.state.lessons;
      })
      .catch(err => {
        this.setState({userAlert: err});
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  }

  deleteListLesson = (lessonId) => {
    console.log("delete listed lesson", lessonId);
  }

  reportLesson = (lessonId) => {
    console.log("reporting lesson", lessonId);
  }


showDetailHandler = lessonId => {
  this.setState(prevState => {
    const selectedLesson = prevState.lessons.find(e => e._id === lessonId);
    this.context.selectedLesson = selectedLesson;
    this.setState({selectedLesson: selectedLesson, showDetail: true});
    return { selectedLesson: selectedLesson };
  });
};

selectLessonNoDetail = (lesson) => {
  this.setState({selectedLesson: lesson});
  this.context.selectedLesson = lesson;
}

hideDetailHandler = () => {
  this.setState({showDetail: false, overlay: false})
}

  onViewAttachment = (attachment) => {
      this.setState({showAttachment: true})
      const file = "https://ent-emr-bucket.s3-us-east-2.amazonaws.com/"+attachment.path+"/"+attachment.name;
      const type = attachment.format;

      this.setState({showThisAttachmentFile: file, showThisAttachmentType: type, })
  }

  closeAttachmentView = () => {
      this.setState({showAttachment: false})
  }

  userSearchClearlHandler () {
    this.setState({searchUsers: [], userAlert: "clearing user search results"});
  }

  showSidebar = () => {
      this.setState({
        sidebarShow: true,
        mCol2Size: 9
      })
  }

  hideSidebar = () => {
      this.setState({
        sidebarShow: false,
        mCol2Size: 11
      })
  }

  componentWillUnmount() {
    this.isActive = false;
  }

  render() {
    return (
    <React.Fragment>
      {this.state.showAttachment === true && (
        <AttachmentViewer
          onCloseAttachmentView={this.closeAttachmentView}
          attachmentFile={this.state.showThisAttachmentFile}
          attachmentType={this.state.showThisAttachmentType}
        />
      )}
      <AlertBox
        authId={this.context.activityId}
        alert={this.state.userAlert}
      />

      {this.state.showDetail === true && (
        <LessonDetailViewer
          lesson={this.state.selectedLesson}
          onHideLessonDetail={this.hideDetailHandler}
          canDelete={this.state.canDelete}
          onDelete={this.deleteListLesson}
          canReport={this.state.canReport}
          onReport={this.reportLesson}
        />
      )}
      <SidebarControl
        onShowSidebar={this.showSidebar}
        onHideSidebar={this.hideSidebar}
      />
      {this.state.overlay === true && (
        <LoadingOverlay
          status={this.state.overlayStatus}
        />
      )}

      <Accordion>

        <Row>
        <Col md={2} className="MasterCol1">
        <SidebarPage
          you={this.context.user}
          authId={this.context.activityId}
        />
        </Col>

        <Col md={this.state.mCol2Size} className="MasterCol2">
            <Container className="containerCombinedDetail1">
              <Tab.Container id="left-tabs-example" defaultActiveKey="MasterList">
                <Row>
                  <Col sm={2} className="userListSubMenuCol">
                    <Nav variant="pills" className="flex-column">
                      <Nav.Item>
                        <Nav.Link eventKey="MasterList">List</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="SearchInput">Search</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="Create">+ Lesson</Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Col>

                  <Col sm={10} className="userListMainCol">
                    <Tab.Content>

                      <Tab.Pane eventKey="MasterList">
                        <Row className="userListRow">

                         {this.state.isLoading ? (
                           <Spinner />
                         ) : (
                           <LessonList
                            canReport={this.state.canReport}
                            onReport={this.reportLesson}
                             lessons={this.state.lessons}
                             authId={this.context.activityId}
                             onViewDetail={this.showDetailHandler}
                             onSelectNoDetail={this.selectLessonNoDetail}
                           />
                         )}
                        </Row>
                      </Tab.Pane>

                      <Tab.Pane eventKey="SearchInput">
                        <Container className="containerSearchUserInput1">

                        <Row className="searchUserRowForm1">
                        <Col md={10} className="searchUserColForm">
                        <Tabs defaultActiveKey="Field" id="uncontrolled-tab-example">

                        <Tab eventKey="Field" title="Search by Field:">
                          <SearchLessonForm
                          authId={this.context.activityId}
                          canCancel
                            canConfirm
                            onCancel={this.modalCancelHandler}
                            onConfirm={this.modalConfirmSearchHandler}
                            confirmText="Search"
                          />
                        </Tab>
                        </Tabs>
                        </Col>
                        </Row>

                        <Row>
                          <Card className="searchCard">
                            <Card.Body className="searchCardBody">
                              <Card.Title>This Search</Card.Title>
                              <Card.Text>
                                Field: {this.state.lessonSearchField}  ,   Query: {this.state.lessonSearchQuery}
                              </Card.Text>
                            </Card.Body>
                          </Card>
                        </Row>
                        <Row className="searchListRow1">

                        {this.state.searchLessons !== [] && (
                          <SearchLessonList
                            searchLessons={this.state.searchLessons}
                            authId={this.context.activityId}
                            onViewDetail={this.showDetailHandler}
                          />
                        )}
                        </Row>

                        </Container>
                      </Tab.Pane>

                      <Tab.Pane eventKey="Create">
                        <Button variant="outline-primary" size="lg" className="confirmEditButton" onClick={props.startCreateLesson}>+ Lesson</Button>

                        <Row className="userListRow">
                          {this.state.creating === true && (
                            <CreateLessonForm
                              authId={this.context.activityId}
                              creator={this.context.user}
                              canCancel
                                canConfirm
                                onCancel={this.modalCancelHandler}
                                onConfirm={this.createLessonHandler}
                            />
                          )}
                        </Row>
                      </Tab.Pane>
                    </Tab.Content>
                  </Col>
                </Row>
              </Tab.Container>
            </Container>
        </Col>
      </Row>
  </Accordion>
</React.Fragment>
    );
  }
}

export default LessonsPage;
