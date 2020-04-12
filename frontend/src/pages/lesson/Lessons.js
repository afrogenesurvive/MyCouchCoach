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
import SearchLessonList from '../../components/Lessons/LessonList/SearchLessonList';
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
    sessionsLoaded: false,
    creatingSession: false,
    editingLesson: false,
    editingLessonField: false,
    showSchedule: false,
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

    this.fetchLessonsBasic();
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

    // if (
    //   field.trim().length === 0 ||
    //   query.trim().length === 0
    // ) {
    //   this.setState({userAlert: "blank fields detected!!!...Please try again..."})
    //   return;
    // }
    //
    // const search = { field, query };
    // const requestBody = {
    //   query: `
    //
    //   `}
    //
    // fetch('http://ec2-54-173-208-178.compute-1.amazonaws.com/graphql', {
    //   method: 'POST',
    //   body: JSON.stringify(requestBody),
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: 'Bearer ' + token
    //   }
    // })
    //   .then(res => {
    //     if (res.status !== 200 && res.status !== 201) {
    //       throw new Error('Failed!');
    //     }
    //     return res.json();
    //   })
    //   .then(resData => {
    //     const responseAlert = JSON.stringify(resData.data).slice(0,8);
    //     const searchLessons = resData.data.;
    //     this.setState({ searchUsers: searchLessons, userAlert: responseAlert})
    //   })
    //   .catch(err => {
    //     this.setState({userAlert: err});
    //   });
  }

  startCreateLesson = () => {
    this.setState({creating: true})
  }
  createLessonHandler = (event) => {
    this.setState({creating: false})
    let activityId = this.context.activityId;
    const creatorId = activityId;
    const token = this.context.token;

    const title = event.target.formGridTitle.value;
    const subtitle = event.target.formGridSubtitle.value;
    const type = event.target.formGridType.value;
    const category = event.target.formGridCategory.value;
    const sku = event.target.formGridSku.value;
    const price = event.target.formGridPrice.value;
    const points = event.target.formGridPoints.value;
    const description = event.target.formGridDescription.value;
    const notes = event.target.formGridNotes.value;
    const duration = event.target.formGridDuration.value;

    const requestBody = {
      query: `
        mutation {createLesson(
          activityId:"${activityId}",
          creatorId:"${creatorId}",
          lessonInput:{
            title:"${title}",
            subtitle:"${subtitle}",
            type:"${type}",
            category:"${category}",
            price:${price},
            points:${points},
            description:"${description}",
            notes:"${notes}",
            duration:"${duration}",
            sku:"${sku}"
          })
        {_id,title,subtitle,type,category,price,points,description,notes,duration,schedule{date,time},instructors{_id,username},gallery{name,type,path},requirements,materials,files{name,type,size,path},reviews{_id,title,author{_id}},tags,sessions{title,date,time,limit,amount,booked{_id,username},bookedAmount,attended{_id,username},attendedAmount,inProgress,full},promos{_id}}}
      `}

    fetch('http://ec2-54-173-208-178.compute-1.amazonaws.com/graphql', {
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
        const responseAlert = JSON.stringify(resData.data.createLesson).slice(0,8);
        this.setState({ lesson: resData.data.createLesson, userAlert: responseAlert})
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  }

  onStartEditLessonBasic = () => {
    this.setState({editingLesson: true})
  }
  onStartEditLessonField = () => {
    console.log('beep!');
    this.setState({editingLessonField: true})
  }
  cancelEditBasic = () => {
    this.setState({editingLesson: false})
  }
  cancelEditField = () => {
    this.setState({editingLessonField: false})
  }
  editLessonBasic = (event) => {
    event.preventDefault();
    this.setState({editingLesson: false})
    let activityId = this.context.activityId;
    const creatorId = activityId;
    const lessonId = this.state.selectedLesson._id;
    const token = this.context.token;

    const title = event.target.formGridTitle.value;
    const subtitle = event.target.formGridSubtitle.value;
    const duration = event.target.formGridDuration.value;
    const type = event.target.formGridType.value;
    const category = event.target.formGridCategory.value;
    const sku = event.target.formGridSku.value;
    const price = event.target.formGridPrice.value;
    const points = event.target.formGridPoints.value;
    const description = event.target.formGridDescription.value;
    const notes = event.target.formGridNotes.value;

    const requestBody = {
      query: `
       mutation {updateLessonBasic(
         activityId:"${activityId}",
         lessonId:"${lessonId}",
         lessonInput:{
           title:"${title}",
           subtitle:"${subtitle}",
           type:"${type}",
           category:"${category}",
           price:${price},
           sku:"${sku}",
           points:${points},
           description:"${description}",
           notes:"${notes}",
           duration:"${duration}"
         })
    {_id,title,subtitle,type,category,price,sku,points,description,notes,duration,schedule{date,time},instructors{_id,username,contact{phone,phone2,email}},tags}}
    `}

    fetch('http://ec2-54-173-208-178.compute-1.amazonaws.com/graphql', {
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
        const responseAlert = JSON.stringify(resData.data.updateLessonBasic).slice(0,8);
        this.setState({ lesson: resData.data.updateLessonBasic, userAlert: responseAlert})
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  }
  editLessonField = (event) => {
    event.preventDefault();
    this.setState({editingLessonField: false})
    let activityId = this.context.activityId;
    const creatorId = activityId;
    const lessonId = this.state.selectedLesson._id;
    const token = this.context.token;

    const field = event.target.formGridFieldSelect.value;
    const query = event.target.formGridQuery.value;
    const requestBody = {
      query: `
         mutation {updateLessonByField(
           activityId:"${activityId}",
           lessonId:"${lessonId}",
           field:"${field}",
           query:"${query}"
         )
         {_id,title,subtitle,type,category,price,sku,points,description,notes,duration,schedule{date,time},instructors{_id,username},gallery{name,type,path},requirements,materials,files{name,type,size,path},reviews{_id,title,author{_id}},tags,sessions{title,date,time,limit,amount,booked{_id,username},bookedAmount,attended{_id,username},attendedAmount,inProgress,full},promos{_id}}}
          `}

    fetch('http://ec2-54-173-208-178.compute-1.amazonaws.com/graphql', {
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
        const responseAlert = JSON.stringify(resData.data.updateLessonByField).slice(0,8);
        this.setState({ lesson: resData.data.updateLessonByField, userAlert: responseAlert})
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  }
  modalCancelHandler = () => {
    this.setState({ creating: false, updating: false, deleting: false, searching: false});
  };

  fetchLessonsBasic() {
    const activityId = this.context.activityId;
    this.setState({ isLoading: true, userAlert: "Fetching Lesson Master List..." });
    const requestBody = {
      query: `
        query {getAllLessons(activityId:"${activityId}")
        {_id,title,subtitle,type,category,price,sku,points,description,notes,duration,schedule{date,time},instructors{_id,username,contact{phone,phone2,email}},tags}}
        `};

    fetch('http://ec2-54-173-208-178.compute-1.amazonaws.com/graphql', {
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
        this.setState({userAlert: responseAlert, lessons: resData.data.getAllLessons, isLoading: false});
        this.context.lessons = this.state.lessons;
      })
      .catch(err => {
        this.setState({userAlert: err});
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  }
  showSchedule = () => {
    this.setState({showSchedule: true})
  };
  hideSchedule = () => {
    this.setState({showSchedule: false})
  };

  loadSessions = (args) => {
    console.log('retriving sessions for this lesson');
    this.setState({userAlert: 'retriving sessions for this lesson'})
    const activityId = this.context.activityId;
    const lessonId = this.state.selectedLesson._id;
    const requestBody = {
      query: `
        query {getLessonById(
          activityId:"${activityId}",
          lessonId:"${lessonId}"
        )
        {_id,title,subtitle,type,category,price,sku,points,description,notes,duration,schedule{date,time},instructors{_id,username,contact{phone,phone2,email}},tags,sessions{title,date,time,limit,inProgress,full}}}
        `};

    fetch('http://ec2-54-173-208-178.compute-1.amazonaws.com/graphql', {
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
        this.setState({userAlert: responseAlert, selectedLesson: resData.data.getLessonById, isLoading: false, sessionsLoaded: true});
        this.context.selectedLesson = this.state.selectedLesson;
      })
      .catch(err => {
        this.setState({userAlert: err});
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });

  };
  hideSessions = () => {
    this.setState({sessionsLoaded: false})
  };
  addCartLesson = (args) => {
    console.log('adding lesson to cart');
    this.setState({userAlert: 'adding lesson to cart'});

    const activityId = this.context.activityId;
    const userId = activityId;
    const lessonId = this.state.selectedLesson._id;
    const sessionTitle = args.title;
    const sessionDate = new Date (args.date.substr(0,10)*1000).toISOString().slice(0,10);

    const requestBody = {
      query: `
            mutation {addUserCartLesson(
              activityId:"${activityId}",
              userId:"${userId}",
              lessonId:"${lessonId}",
              sessionDate:"${sessionDate}")
            {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title}},reviews{_id,date,type,title},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username}},orders{_id,date,time,type,buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
        `};

    fetch('http://ec2-54-173-208-178.compute-1.amazonaws.com/graphql', {
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
        this.setState({userAlert: responseAlert, isLoading: false});
        this.context.selectedUser = resData.data.addUserCartLesson;
      })
      .catch(err => {
        this.setState({userAlert: err});
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  };
  bookSession = (args) => {
    console.log('booking lesson session');
    this.setState({userAlert: 'booking lesson session'});

    const activityId = this.context.activityId;
    const userId = activityId;
    const lessonId = this.state.selectedLesson._id;
    const sessionTitle = args.title;
    const sessionDate = new Date (args.date.substr(0,10)*1000).toISOString().slice(0,10);

    const requestBody = {
      query: `
            mutation {addLessonBooking(
              activityId:"${activityId}",
              lessonId:"${lessonId}",
              userId:"${userId}",
              lessonInput:{
                sessionTitle:"${sessionTitle}",
                sessionDate:"${sessionDate}"
              })
            {_id,title,subtitle,type,category,price,points,description,notes,duration,schedule{date,time},instructors{_id,username,contact{phone,phone2,email}},gallery{name,type,path},requirements,materials,files{name,type,size,path},reviews{_id},tags,sessions{title,date,time,limit,amount,booked{_id},bookedAmount,attended{_id},attendedAmount,inProgress,full},promos{_id}}}
        `};

    fetch('http://ec2-54-173-208-178.compute-1.amazonaws.com/graphql', {
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
        this.setState({userAlert: responseAlert, selectedLesson: resData.data.addLessonBooking, isLoading: false});
        this.context.selectedLesson = this.state.selectedLesson;
      })
      .catch(err => {
        this.setState({userAlert: err});
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  };

  startCreateSession = (args) => {
    this.setState({creatingSession: true})
  };
  cancelCreateSession = () => {
    this.setState({creatingSession: false})
  };
  createLessonSession = (event) => {
    console.log('creating new lesson session');
    this.setState({userAlert: 'creating new lesson session'});

    const activityId = this.context.activityId;
    const userId = activityId;
    const lessonId = this.state.selectedLesson._id;

    const sessionTitle = event.target.formGridTitle.value;
    // const sessionDate = new Date (event.target.patientReferralCalendarVisitDate.value.substr(0,10)*1000).toISOString().slice(0,10);
    let sessionDate = event.target.CalendarDate.value;
    sessionDate = new Date(sessionDate).toISOString().slice(0,10);
    const sessionTime = event.target.formGridTime.value;
    const sessionLimit = event.target.formGridLimit.value;
    const sessionAmount = 0;

    const requestBody = {
      query: `
          mutation {addLessonSession(
            activityId:"${activityId}",
            lessonId:"${lessonId}",
            lessonInput:{
              sessionTitle:"${sessionTitle}",
              sessionDate:"${sessionDate}",
              sessionTime:"${sessionTime}",
              sessionLimit:${sessionLimit},
              sessionAmount:${sessionAmount}
            })
            {_id,title,subtitle,type,category,price,sku,points,description,notes,duration,schedule{date,time},instructors{_id,username,contact{phone,phone2,email}},tags,sessions{title,date,time,limit,inProgress,full}}}
        `};

        // console.log('xxx',JSON.stringify(requestBody));

    fetch('http://ec2-54-173-208-178.compute-1.amazonaws.com/graphql', {
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
        this.setState({userAlert: responseAlert, selectedLesson: resData.data.addLessonBooking, isLoading: false});
        this.context.selectedLesson = this.state.selectedLesson;
      })
      .catch(err => {
        this.setState({userAlert: err});
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  };

  deleteListLesson = (lessonId) => {
    console.log("delete listed lesson", lessonId);
  };
  reportLesson = (lessonId) => {
    console.log("reporting lesson", lessonId);
  };

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
  };

  hideDetailHandler = () => {
  this.setState({showDetail: false, overlay: false})
};
  onViewAttachment = (attachment) => {
      this.setState({showAttachment: true})
      const file = "https://ent-emr-bucket.s3-us-east-2.amazonaws.com/"+attachment.path+"/"+attachment.name;
      const type = attachment.format;

      this.setState({showThisAttachmentFile: file, showThisAttachmentType: type, })
  };
  closeAttachmentView = () => {
      this.setState({showAttachment: false})
  };

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
          authId={this.context.activityId}
          lesson={this.state.selectedLesson}
          onHideLessonDetail={this.hideDetailHandler}
          sessionsLoaded={this.state.sessionsLoaded}
          onSessionLoad={this.loadSessions}
          onHideSessions={this.hideSessions}
          onBookSession={this.bookSession}
          onAddCartLesson={this.addCartLesson}
          startCreateSession={this.startCreateSession}
          creatingSession={this.state.creatingSession}
          cancelCreateSession={this.cancelCreateSession}
          createLessonSession={this.createLessonSession}
          onStartEditLessonBasic={this.onStartEditLessonBasic}
          onStartEditLessonField={this.onStartEditLessonField}
          editingLesson={this.state.editingLesson}
          editingLessonField={this.state.editingLessonField}
          cancelEditBasic={this.cancelEditBasic}
          cancelEditField={this.cancelEditField}
          editLessonBasic={this.editLessonBasic}
          editLessonField={this.editLessonField}
          showScheduleState={this.state.showSchedule}
          showSchedule={this.showSchedule}
          hideSchedule={this.hideSchedule}
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
                        <Button variant="outline-primary" size="lg" className="confirmEditButton" onClick={this.startCreateLesson}>+ Lesson</Button>

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
