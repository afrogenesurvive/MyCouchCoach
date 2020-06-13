// import S3 from 'react-aws-s3';
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
// import LessonDetail from '../../components/Lessons/LessonDetail';
import SearchSession from '../../components/Lessons/LessonList/LessonItem/SearchSession';

import Spinner from '../../components/Spinner/Spinner';
import SidebarPage from '../Sidebar';
import SidebarControl from '../../components/SidebarControl';
import AlertBox from '../../components/AlertBox';
import LoadingOverlay from '../../components/LoadingOverlay';
import AttachmentViewer from '../../components/AttachmentViewer';
import LessonDetailViewer from '../../components/LessonDetailViewer';

import CreateLessonForm from '../../components/Forms/lesson/CreateLessonForm';
import SearchLessonFieldRegexForm from '../../components/Forms/lesson/SearchLessonFieldRegexForm';
import SearchLessonFieldBasicForm from '../../components/Forms/lesson/SearchLessonFieldBasicForm';
import SearchLessonSessionForm from '../../components/Forms/lesson/SearchLessonSessionForm';


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
    searchSession: null,
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
    showScheduleState: false,
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
    mCol2Size: 10,
    sessionBookedState: false,
    sessionAttendedState: false,
    activityA: null,
    showInstructorsState: false,
    showRequirementsState: false,
    showMaterialsState: false,
    showTagsState: false,
    showFilesState: false,
    showImagesState: false,
    showReviewsState: false,
    lessonAddField: null,
    sessionDetailViewer: false,
    calendarSession: null,
    filter: {
      field: null,
      key: null,
      value: null
    },
  };
  isActive = true;
  static contextType = AuthContext;

  componentDidMount() {
    console.log('...lessons component mounted...');
    if (this.context.role === "Admin"){
      this.setState({canDelete: true})
    }

    if (JSON.stringify(this.context.selectedLesson) !== '{}') {
      this.setState({ selectedLesson: this.context.selectedLesson })
    }

    this.fetchLessonsBasic();
  }

  componentWillUnmount() {
    this.isActive = false;
    console.log('...lessons component un-mounting...');
  }

  modalConfirmSearchRegexHandler = (event) => {
    event.preventDefault();
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
      userAlert: "Searching for Lesson..."
    })

    if (
      field.trim().length === 0 ||
      query.trim().length === 0
    ) {
      this.setState({userAlert: "blank fields detected!!!...Please try again..."})
      return;
    }

    const requestBody = {
      query: `
        query {getLessonsByFieldRegex(
          activityId:"${activityId}",
          field:"${field}",
          query:"${query}")
          {_id,title,subtitle,type,category,price,sku,points,description,notes,duration,schedule{date,time},instructors{_id,username},attendees{_id,username},gallery{name,type,path},requirements,materials,files{name,type,size,path},reviews{_id,title,author{_id}},tags,sessions{title,date,time,limit,amount,booked{_id,username},bookedAmount,attended{_id,username},attendedAmount,inProgress,full,url},promos{_id}}}
      `}

    fetch('http://localhost:8088/graphql', {
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
        if (resData.errors) {
          this.setState({userAlert: resData.errors[0].message})
        } else {
          const responseAlert = JSON.stringify(resData.data.getLessonsByFieldRegex).slice(0,8);
          const searchLessons = resData.data.getLessonsByFieldRegex;
          this.setState({ searchLessons: searchLessons, userAlert: '...success!...', activityA: requestBody})
        }

        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  }
  modalConfirmSearchBasicHandler = (event) => {
    event.preventDefault();
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
      userAlert: "Searching for Lesson..."
    })

    if (
      field.trim().length === 0 ||
      query.trim().length === 0
    ) {
      this.setState({userAlert: "blank fields detected!!!...Please try again..."})
      return;
    }

    const requestBody = {
      query: `
        query {getLessonsByField(
          activityId:"${activityId}",
          field:"${field}",
          query:"${query}")
          {_id,title,subtitle,type,category,price,sku,points,description,notes,duration,schedule{date,time},instructors{_id,username},attendees{_id,username},gallery{name,type,path},requirements,materials,files{name,type,size,path},reviews{_id,title,author{_id}},tags,sessions{title,date,time,limit,amount,booked{_id,username},bookedAmount,attended{_id,username},attendedAmount,inProgress,full,url},promos{_id}}}
      `}

    fetch('http://localhost:8088/graphql', {
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
        if (resData.errors) {
          this.setState({userAlert: resData.errors[0].message})
        } else {
          const responseAlert = JSON.stringify(resData.data.getLessonsByField).slice(0,8);
          const searchLessons = resData.data.getLessonsByField;
          this.setState({ searchLessons: searchLessons, userAlert: responseAlert, activityA: requestBody})
        }

        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  }
  modalConfirmSearchSessionHandler = (event) => {
    event.preventDefault();
    let activityId = this.context.activityId;
    const token = this.context.token;
    const lessonId = this.state.selectedLesson._id;
    const sessionDate = event.target.formGridSessionDate.value;
    const sessionTitle = event.target.formGridSessionTitle.value;

    const requestBody = {
      query: `
        query {getLessonSession(
          activityId:"${activityId}",
          lessonId:"${lessonId}",
          lessonInput:{
            sessionTitle:"${sessionTitle}",
            sessionDate:"${sessionDate}"
          })
          {title,date,time,limit,amount,bookedAmount,booked{_id,username},attendedAmount,attended{_id,username},inProgress,full,url,lessonId,lessonTitle,lessonInstructors,userId}}
      `}

    fetch('http://localhost:8088/graphql', {
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
        if (resData.errors) {
          this.setState({userAlert: resData.errors[0].message})
        } else {
          const responseAlert = JSON.stringify(resData.data.getLessonSession).slice(0,8);
          const searchSession = resData.data.getLessonSession;
          this.setState({ searchSession: searchSession, userAlert: responseAlert, activityId: requestBody})
        }

        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
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
    const lessonPublic = event.target.formGridPublic.value;
    const type = event.target.formGridType.value;
    const subType = event.target.formGridSubType.value;
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
            subType:"${subType}",
            public:${lessonPublic},
            category:"${category}",
            price:${price},
            points:${points},
            description:"${description}",
            notes:"${notes}",
            duration:"${duration}",
            sku:"${sku}"
          })
        {_id,title,subtitle,type,subType,public,category,price,points,description,notes,duration,schedule{date,time},instructors{_id,username,contact{email,phone,phone2}},gallery{name,type,path,public},requirements,materials,files{name,type,size,path,public},reviews{_id},tags,sessions{title,date,endDate,time,limit,amount,booked{_id,username},bookedAmount,attended{_id,username},attendedAmount,inProgress,full,url},promos{_id},reviews{date,type,title,body,author{_id,username},body,rating},cancellations{date,reason,sessionDate,sessionTitle,user{_id,username}},reminders{_id,createDate,sendDate,creator{_id,username,contact{email,phone}},type,title,time,trigger{unit,value},lesson{_id,title},session{title,date,endDate,time},recipients{_id,username,contact{email,phone}},body,delivery{type,params,sent}}}}
      `}

    fetch('http://localhost:8088/graphql', {
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
        if (resData.errors) {
          this.setState({userAlert: resData.errors[0].message})
        } else {
          const responseAlert = JSON.stringify(resData.data.createLesson).slice(0,8);
          this.setState({ lesson: resData.data.createLesson, userAlert: '...success! Lesson created... To Edit, go to MyProfile > Lessons: Teaching...', activityA: requestBody})
        }

        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  }
  onStartEditLessonBasic = () => {
    this.setState({editingLesson: true})
  }
  onStartEditLessonField = () => {
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
    // const creatorId = activityId;
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

    fetch('http://localhost:8088/graphql', {
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
        if (resData.errors) {
          this.setState({userAlert: resData.errors[0].message})
        } else {
          const responseAlert = JSON.stringify(resData.data.updateLessonBasic).slice(0,8);
          this.setState({ lesson: resData.data.updateLessonBasic, userAlert: responseAlert, activityA: requestBody})
        }

        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  }
  editLessonField = (event) => {
    event.preventDefault();
    this.setState({editingLessonField: false})
    let activityId = this.context.activityId;
    // const creatorId = activityId;
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

    fetch('http://localhost:8088/graphql', {
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
        if (resData.errors) {
          this.setState({userAlert: resData.errors[0].message})
        } else {
          const responseAlert = JSON.stringify(resData.data.updateLessonByField).slice(0,8);
          this.setState({ lesson: resData.data.updateLessonByField, userAlert: responseAlert, activityA: requestBody})
        }

        // this.logUserActivity();
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
        {_id,title,subtitle,public,subType,type,category,price,sku,points,description,notes,requirements,materials,duration,files{name,type,size,path,public},gallery{name,type,path,public},schedule{date,time},gallery{name,type,path},instructors{_id,username,contact{phone,phone2,email},socialMedia{platform,handle,link},profileImages{name,type,path}},tags,reviews{_id,title,type,author{_id,username},lesson{_id,title},body,rating}}}
        `};

    fetch('http://localhost:8088/graphql', {
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
        if (resData.errors) {
          this.setState({userAlert: resData.errors[0].message})
        } else {
          const responseAlert = JSON.stringify(resData.data).slice(0,8);
          this.setState({userAlert: responseAlert, lessons: resData.data.getAllLessons, isLoading: false, activityId: requestBody});
          this.context.lessons = this.state.lessons;
        }

        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  }

  loadSessions = (args) => {
    // console.log('retriving sessions for this lesson');
    this.setState({userAlert: 'retriving sessions for this lesson'})
    const activityId = this.context.activityId;
    const lessonId = this.state.selectedLesson._id;
    const requestBody = {
      query: `
        query {getLessonById(
          activityId:"${activityId}",
          lessonId:"${lessonId}"
        )
        {_id,title,subtitle,type,subType,public,category,price,points,description,notes,duration,schedule{date,time},instructors{_id,username,contact{email,phone,phone2}},gallery{name,type,path,public},requirements,materials,files{name,type,size,path,public},reviews{_id},tags,sessions{title,date,endDate,time,limit,amount,booked{_id,username},bookedAmount,attended{_id,username},attendedAmount,inProgress,full,url},promos{_id},reviews{date,type,title,body,author{_id,username},body,rating},cancellations{date,reason,sessionDate,sessionTitle,user{_id,username}},reminders{_id,createDate,sendDate,creator{_id,username,contact{email,phone}},type,title,time,trigger{unit,value},lesson{_id,title},session{title,date,endDate,time},recipients{_id,username,contact{email,phone}},body,delivery{type,params,sent}}}}
        `};

    fetch('http://localhost:8088/graphql', {
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
        if (resData.errors) {
          this.setState({userAlert: resData.errors[0].message})
        } else {
          const responseAlert = JSON.stringify(resData.data).slice(0,8);
          this.setState({userAlert: responseAlert, selectedLesson: resData.data.getLessonById, isLoading: false, sessionsLoaded: true, activityId: requestBody});
          this.context.selectedLesson = this.state.selectedLesson;
        }

        // this.logUserActivity();
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
    let sessionDate = null;
    if (this.state.sessionDetailViewer === true) {
      sessionDate = args.date;
    } else {
      sessionDate = new Date (args.date.substr(0,10)*1000).toISOString().slice(0,10);
    }

    const requestBody = {
      query: `
            mutation {addUserCartLesson(
              activityId:"${activityId}",
              userId:"${userId}",
              lessonId:"${lessonId}",
              sessionDate:"${sessionDate}",
              sessionTitle:"${sessionTitle}"
            )
            {_id,password,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title}},reviews{_id,date,type,title},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username}},orders{_id,date,time,type,buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
        `};

    fetch('http://localhost:8088/graphql', {
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
        if (resData.errors) {
          this.setState({userAlert: resData.errors[0].message})
        } else {
          const responseAlert = JSON.stringify(resData.data).slice(0,8);
          this.setState({userAlert: '...success! Lesson added to cart...', isLoading: false, activityA: requestBody});
          this.context.selectedUser = resData.data.addUserCartLesson;
        }

        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  };
  bookSession = (args) => {
    console.log('booking lesson session',args.date);

    this.setState({userAlert: 'booking lesson session'});

    const activityId = this.context.activityId;
    const userId = activityId;
    const lessonId = this.state.selectedLesson._id;
    const sessionTitle = args.title;
    let sessionDate = null;
    if (this.state.sessionDetailViewer === true) {
      sessionDate = args.date;
    } else {
      sessionDate = new Date (args.date.substr(0,10)*1000).toISOString().slice(0,10);
    }
    const sessionTime = args.time;

    const requestBody = {
      query: `
            mutation {addLessonBooking(
              activityId:"${activityId}",
              lessonId:"${lessonId}",
              userId:"${userId}",
              lessonInput:{
                sessionTitle:"${sessionTitle}",
                sessionDate:"${sessionDate}",
                sessionTime:"${sessionTime}"
              })
            {_id,title,subtitle,public,type,category,price,points,description,notes,duration,schedule{date,time},instructors{_id,username,contact{phone,phone2,email}},gallery{name,type,path,public},requirements,materials,files{name,type,size,path,public},reviews{_id},tags,sessions{title,date,endDate,time,limit,amount,booked{_id},bookedAmount,attended{_id},attendedAmount,inProgress,full},promos{_id}}}
        `};



    fetch('http://localhost:8088/graphql', {
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
        if (resData.errors) {
          this.setState({userAlert: resData.errors[0].message})
        } else {
          let responseAlert = null;
          if (resData.errors) {
            responseAlert = resData.errors[0].message;
            // console.log(responseAlert);
            this.setState({userAlert: responseAlert})
          }
          if (resData.data.addLessonBooking !== null) {
            responseAlert = JSON.stringify(resData.data).slice(0,8);
            this.setState({userAlert: '...success! Session booked...', selectedLesson: resData.data.addLessonBooking, isLoading: false, activityA: requestBody});
            this.context.selectedLesson = this.state.selectedLesson;
          }
        }
        // this.logUserActivity();
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
    event.preventDefault();
    console.log('creating new lesson session');
    this.setState({userAlert: 'creating new lesson session'});

    const activityId = this.context.activityId;
    // const userId = activityId;
    const lessonId = this.state.selectedLesson._id;

    const sessionTitle = event.target.formGridTitle.value;
    // const sessionDate = new Date (event.target.patientReferralCalendarVisitDate.value.substr(0,10)*1000).toLocaleDateString().slice(0,10);
    let sessionDate = event.target.CalendarDate.value;
    sessionDate = new Date(sessionDate).toLocaleDateString().slice(0,10);
    let sessionEndDate = sessionDate;
    if (event.target.CalendarEndDate) {
      sessionEndDate = event.target.CalendarEndDate.value;
    }
    const sessionTime = event.target.formGridTime.value;
    const sessionLimit = event.target.formGridLimit.value;
    const sessionAmount = 0;
    const sessionUrl = "";

    // console.log('sessionEndDate > sessionDate',new Date(sessionEndDate) > new Date(sessionDate));
    if (new Date(sessionEndDate) < new Date(sessionDate)) {
      console.log('...start and end date incompatible!! check your dates and try again..');
      this.setState({userAlert: '...start and end date incompatible!! check your dates and try again..'});
      return
    }

    const requestBody = {
      query: `
      mutation {addLessonSession(
        activityId:"${activityId}",
        lessonId:"${lessonId}",
        lessonInput:{
          sessionTitle:"${sessionTitle}",
          sessionDate:"${sessionDate}",
          sessionEndDate:"${sessionEndDate}",
          sessionTime:"${sessionTime}",
          sessionLimit:${sessionLimit},
          sessionAmount:${sessionAmount},
          sessionUrl:"${sessionUrl}"
        })
            {_id,title,subtitle,public,type,subType,category,price,sku,points,description,notes,duration,schedule{date,time},instructors{_id,username,contact{phone,phone2,email}},tags,sessions{title,date,endDate,time,limit,inProgress,full}}}
        `};

    fetch('http://localhost:8088/graphql', {
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
        if (resData.errors) {
          this.setState({userAlert: resData.errors[0].message})
        } else {
          const responseAlert = JSON.stringify(resData.data).slice(0,8);
          this.setState({userAlert: responseAlert, selectedLesson: resData.data.addLessonSession, isLoading: false, creatingSession: false, activityA: requestBody});
          this.context.selectedLesson = this.state.selectedLesson;
        }

        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  };

  showSessionBooked = () => {
    this.setState({sessionBookedState: true})
  }
  hideSessionBooked = () => {
    this.setState({sessionBookedState: false})
  }
  hideSessionAttended = () => {
    this.setState({sessionAttendedState: false})
  }

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
  this.setState({showDetail: false, overlay: false, sessionsLoaded: false})
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

  logUserActivity() {
    console.log('logUserActivity...');
    this.setState({userAlert: 'logUserActivity...'})
    const activityId = this.context.activityId;
    const userId = activityId;
    const token = this.context.token;
    // const today = new Date();
    const request = this.state.activityA;

    const requestBody = {
      query:`
          mutation {addUserActivity(
            activityId:"${activityId}",
            userId:"${userId}",
            userInput:{
              activityRequest:"${request}"
            })
          {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path,public},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,name,username,role,dob,public,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path,public},socialMedia{platform,handle,link}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,public,type,subType,category,price},bookedLessons{date,session{date,title,time},ref{_id,title,public,type,subType,category,price,gallery{name,type,path,public},files{name,type,size,path,public}}},attendedLessons{date,ref{_id,title,public,type,subType,category,price,gallery{name,type,path,public},files{name,type,size,path,public}}},toTeachLessons{_id,title,public,type,subType,category,price,gallery{name,type,path,public},files{name,type,size,path,public}},taughtLessons{date,ref{_id,title,public,type,subType,category,price,gallery{name,type,path,public},files{name,type,size,path,public}}},wishlist{date,ref{_id,title,public,type,subType,category,price},booked},cart{dateAdded,sessionDate,sessionTitle,lesson{_id,title,public,type,subType,sku,price}},reviews{_id,date,type,title,author{_id,username},lesson{_id,title},body,rating},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username},subject,message,read},orders{_id,date,time,type,totals{a,b,c},buyer{_id,username},receiver{_id,username},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}},cancellations{date,reason,sessionDate,sessionTitle,lesson{_id,title}},notifications{_id,createDate,sendDate,creator{_id,username,contact{email,phone}},type,title,time,trigger{unit,value},lesson{_id,title,public,type,subType,},session{title,date,endDate,time},recipients{_id,username,contact{email,phone}},body,delivery{type,params,sent}}}}
      `};

    fetch('http://localhost:8088/graphql', {
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
        if (resData.errors) {
          this.setState({userAlert: resData.errors[0].message})
        } else {
          const responseAlert = JSON.stringify(resData.data.addUserActivity).slice(2,25);
          this.setState({userAlert: responseAlert, user: resData.data.addUserActivity})
          this.context.user = this.state.user;
        }

      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };

  toggleInstructors = () => {
    if (this.state.showInstructorsState === false) {
      this.setState({showInstructorsState: true})
    } else {
      this.setState({showInstructorsState: false})
    }
  }
  toggleSchedule = () => {
    if (this.state.showScheduleState === false) {
      this.setState({showScheduleState: true})
    } else {
      this.setState({showScheduleState: false})
    }
  }
  toggleRequirements = () => {
    if (this.state.showRequirementsState === false) {
      this.setState({showRequirementsState: true})
    } else {
      this.setState({showRequirementsState: false})
    }
  }
  toggleMaterials = () => {
    if (this.state.showMaterialsState === false) {
      this.setState({showMaterialsState: true})
    } else {
      this.setState({showMaterialsState: false})
    }
  }
  toggleTags = () => {
    if (this.state.showTagsState === false) {
      this.setState({showTagsState: true})
    } else {
      this.setState({showTagsState: false})
    }
  }
  toggleImages = () => {
    if (this.state.showImagesState === false) {
      this.setState({showImagesState: true})
    } else {
      this.setState({showImagesState: false})
    }
  }
  toggleFiles = () => {
    if (this.state.showFilesState === false) {
      this.setState({showFilesState: true})
    } else {
      this.setState({showFilesState: false})
    }
  }
  toggleReviews = () => {
    if (this.state.showReviewsState === false) {
      this.setState({showReviewsState: true})
    } else {
      this.setState({showReviewsState: false})
    }
  }

  startLessonAdd = (args) => {
    // console.log(args);
    this.setState({lessonAddField: args})
  }
  cancelLessonAdd = (args) => {
    this.setState({lessonAddField: null})
  }

  addLessonMaterials = (event) => {
    event.preventDefault();
    this.setState({userAlert: '...adding lesson materials...', lessonAddField: null });
    const activityId = this.context.activityId;
    const lessonId = this.state.selectedLesson._id;

    const materials = event.target.formGridMaterials.value;

    const requestBody = {
      query: `
          mutation {addLessonMaterials(
            activityId:"${activityId}",
            lessonId:"${lessonId}",
            lessonInput:{
              materials: "${materials}"
            })
            {_id,title,subtitle,type,category,price,sku,points,description,notes,requirements,materials,duration,files{name,type,size,path},gallery{name,type,path},schedule{date,time},gallery{name,type,path},instructors{_id,username,contact{phone,phone2,email},socialMedia{platform,handle,link},profileImages{name,type,path}},tags,reviews{_id,title,type,author{_id,username},lesson{_id,title},body,rating}}}
        `};

    fetch('http://localhost:8088/graphql', {
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
        if (resData.errors) {
          this.setState({userAlert: resData.errors[0].message})
        } else {
          const responseAlert = JSON.stringify(resData.data).slice(0,8);
          this.setState({userAlert: responseAlert, selectedLesson: resData.data.addLessonMaterials, activityA: requestBody});
          this.context.selectedLesson = this.state.selectedLesson;
        }

        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  }
  addLessonTags = (event) => {
    event.preventDefault();
    console.log('...adding lesson tags...');
    this.setState({userAlert: '...adding lesson tags...', lessonAddField: null });
    const activityId = this.context.activityId;
    const lessonId = this.state.selectedLesson._id;

    const tags = event.target.formGridTags.value;

    const requestBody = {
      query: `
          mutation {addLessonTags(
            activityId:"${activityId}",
            lessonId:"${lessonId}",
            lessonInput:{
              tags: "${tags}"
            })
            {_id,title,subtitle,type,category,price,sku,points,description,notes,requirements,materials,duration,files{name,type,size,path},gallery{name,type,path},schedule{date,time},gallery{name,type,path},instructors{_id,username,contact{phone,phone2,email},socialMedia{platform,handle,link},profileImages{name,type,path}},tags,reviews{_id,title,type,author{_id,username},lesson{_id,title},body,rating}}}
        `};

    fetch('http://localhost:8088/graphql', {
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
        if (resData.errors) {
          this.setState({userAlert: resData.errors[0].message})
        } else {
          const responseAlert = JSON.stringify(resData.data).slice(0,8);
          this.setState({userAlert: responseAlert, selectedLesson: resData.data.addLessonTags, activityA: requestBody});
          this.context.selectedLesson = this.state.selectedLesson;
        }

        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  }
  addLessonRequirements = (event) => {
    event.preventDefault();
    // console.log('...adding lesson requirements ...');
    this.setState({userAlert: '...adding lesson requirements ...', lessonAddField: null });
    const activityId = this.context.activityId;
    const lessonId = this.state.selectedLesson._id;

    const requirements = event.target.formGridRequirements.value;

    const requestBody = {
      query: `
          mutation {addLessonRequirements(
            activityId:"${activityId}",
            lessonId:"${lessonId}",
            lessonInput:{
              requirements: "${requirements}"
            })
            {_id,title,subtitle,type,category,price,sku,points,description,notes,requirements,materials,duration,files{name,type,size,path},gallery{name,type,path},schedule{date,time},gallery{name,type,path},instructors{_id,username,contact{phone,phone2,email},socialMedia{platform,handle,link},profileImages{name,type,path}},tags,reviews{_id,title,type,author{_id,username},lesson{_id,title},body,rating}}}
        `};

    fetch('http://localhost:8088/graphql', {
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
        if (resData.errors) {
          this.setState({userAlert: resData.errors[0].message})
        } else {
          const responseAlert = JSON.stringify(resData.data).slice(0,8);
          this.setState({userAlert: responseAlert, selectedLesson: resData.data.addLessonRequirements, activityA: requestBody});
          this.context.selectedLesson = this.state.selectedLesson;
        }

        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  }
  addLessonImage = (event) => {
    event.preventDefault();
    console.log('...adding lesson Images ...');
    this.setState({userAlert: '...adding lesson Images ...', lessonAddField: null });
    const activityId = this.context.activityId;
    const lessonId = this.state.selectedLesson._id;

    const imageName = event.target.formGridImagename.value;
    const imageType = event.target.formGridImagetype.value;
    const imagePath = event.target.formGridImagepath.value;

    const requestBody = {
      query: `
          mutation {addLessonImage(
            activityId:"${activityId}",
            lessonId:"${lessonId}",
            lessonInput:{
              imageName: "${imageName}"
              imageType: "${imageType}"
              imagePath: "${imagePath}"
            })
            {_id,title,subtitle,type,category,price,sku,points,description,notes,requirements,materials,duration,files{name,type,size,path},gallery{name,type,path},schedule{date,time},gallery{name,type,path},instructors{_id,username,contact{phone,phone2,email},socialMedia{platform,handle,link},profileImages{name,type,path}},tags,reviews{_id,title,type,author{_id,username},lesson{_id,title},body,rating}}}
        `};

    fetch('http://localhost:8088/graphql', {
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
        if (resData.errors) {
          this.setState({userAlert: resData.errors[0].message})
        } else {
          const responseAlert = JSON.stringify(resData.data).slice(0,8);
          this.setState({userAlert: responseAlert, selectedLesson: resData.data.addLessonImage, activityA: requestBody});
          this.context.selectedLesson = this.state.selectedLesson;
        }

        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });

  }
  addLessonFile = (event) => {
    event.preventDefault();
    // console.log('...adding lesson Files ...');
    this.setState({userAlert: '...adding lesson Files ...', lessonAddField: null });
    const activityId = this.context.activityId;
    const lessonId = this.state.selectedLesson._id;

    const fileName = event.target.formGridFilename.value;
    const fileType = event.target.formGridFilesize.value;
    const fileSize = event.target.formGridFiletype.value;
    const filePath = event.target.formGridFilepath.value;

    const requestBody = {
      query: `
          mutation {addLessonFile(
            activityId:"${activityId}",
            lessonId:"${lessonId}",
            lessonInput:{
              fileName: "${fileName}"
              fileType: "${fileType}"
              fileSize: "${fileSize}"
              filePath: "${filePath}"
            })
            {_id,title,subtitle,type,category,price,sku,points,description,notes,requirements,materials,duration,files{name,type,size,path},gallery{name,type,path},schedule{date,time},gallery{name,type,path},instructors{_id,username,contact{phone,phone2,email},socialMedia{platform,handle,link},profileImages{name,type,path}},tags,reviews{_id,title,type,author{_id,username},lesson{_id,title},body,rating}}}
        `};

    fetch('http://localhost:8088/graphql', {
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
        if (resData.errors) {
          this.setState({userAlert: resData.errors[0].message})
        } else {
          const responseAlert = JSON.stringify(resData.data).slice(0,8);
          this.setState({userAlert: responseAlert, selectedLesson: resData.data.addLessonFile, activityA: requestBody});
          this.context.selectedLesson = this.state.selectedLesson;
        }

        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });

  }
  addLessonInstructor = (event) => {
    event.preventDefault();
    console.log('...adding lesson instructor ...');
    this.setState({userAlert: '...adding lesson instructor ...', lessonAddField: null });
    const activityId = this.context.activityId;
    const instructorId = this.context.selectedUser._id;
    const lessonId = this.state.selectedLesson._id;

    const requestBody = {
      query: `
          mutation {addLessonInstructor(
            activityId:"${activityId}",
            lessonId:"${lessonId}"
            instructorId: "${instructorId}")
            {_id,title,subtitle,type,category,price,sku,points,description,notes,requirements,materials,duration,files{name,type,size,path},gallery{name,type,path},schedule{date,time},gallery{name,type,path},instructors{_id,username,contact{phone,phone2,email},socialMedia{platform,handle,link},profileImages{name,type,path}},tags,reviews{_id,title,type,author{_id,username},lesson{_id,title},body,rating}}}
        `};

    fetch('http://localhost:8088/graphql', {
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
        if (resData.errors) {
          this.setState({userAlert: resData.errors[0].message})
        } else {
          const responseAlert = JSON.stringify(resData.data).slice(0,8);
          this.setState({userAlert: responseAlert, selectedLesson: resData.data.addLessonInstructor, activityA: requestBody});
          this.context.selectedLesson = this.state.selectedLesson;
        }

        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });

  }

  likeLesson = (args) => {
    // console.log('...adding lesson like...',args);
    this.setState({userAlert: '...adding lesson like...'})
    const activityId = this.context.activityId;
    const userId = activityId;
    const lessonId = this.state.selectedLesson._id;

    const requestBody = {
      query: `
          mutation {addUserLikedLesson(
            activityId:"${activityId}",
            userId: "${userId}",
            lessonId:"${lessonId}",)
            {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path,public},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,name,username,role,dob,public,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path,public},socialMedia{platform,handle,link}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,public,type,subType,category,price},bookedLessons{date,session{date,title,time},ref{_id,title,public,type,subType,category,price,gallery{name,type,path,public},files{name,type,size,path,public}}},attendedLessons{date,ref{_id,title,public,type,subType,category,price,gallery{name,type,path,public},files{name,type,size,path,public}}},toTeachLessons{_id,title,public,type,subType,category,price,gallery{name,type,path,public},files{name,type,size,path,public}},taughtLessons{date,ref{_id,title,public,type,subType,category,price,gallery{name,type,path,public},files{name,type,size,path,public}}},wishlist{date,ref{_id,title,public,type,subType,category,price},booked},cart{dateAdded,sessionDate,sessionTitle,lesson{_id,title,public,type,subType,sku,price}},reviews{_id,date,type,title,author{_id,username},lesson{_id,title},body,rating},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username},subject,message,read},orders{_id,date,time,type,totals{a,b,c},buyer{_id,username},receiver{_id,username},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}},cancellations{date,reason,sessionDate,sessionTitle,lesson{_id,title}},notifications{_id,createDate,sendDate,creator{_id,username,contact{email,phone}},type,title,time,trigger{unit,value},lesson{_id,title,public,type,subType,},session{title,date,endDate,time},recipients{_id,username,contact{email,phone}},body,delivery{type,params,sent}}}}
        `};

    fetch('http://localhost:8088/graphql', {
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
        if (resData.errors) {
          this.setState({userAlert: resData.errors[0].message})
        } else {
          this.setState({userAlert: '...success! Lesson liked...'})
          // const responseAlert = JSON.stringify(resData.data).slice(0,8);
          this.context.user = resData.data.addUserLikedLesson;
        }

      })
      .catch(err => {
        this.setState({userAlert: err});
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  }

  deleteLessonTag = (args) => {
    console.log('...deleting lesson tag...',args);
    this.setState({userAlert: '...adding lesson instructor ...', lessonAddField: null });
    const activityId = this.context.activityId;
    const lessonId = this.state.selectedLesson._id;
    const tag = args;

    const requestBody = {
      query: `
          mutation {deleteLessonTag(
            activityId:"${activityId}",
            lessonId:"${lessonId}",
            lessonInput:{
              tag:"${tag}"
            })
            {_id,title,subtitle,type,category,price,sku,points,description,notes,requirements,materials,duration,files{name,type,size,path},gallery{name,type,path},schedule{date,time},gallery{name,type,path},instructors{_id,username,contact{phone,phone2,email},socialMedia{platform,handle,link},profileImages{name,type,path}},tags,reviews{_id,title,type,author{_id,username},lesson{_id,title},body,rating}}}
        `};

    fetch('http://localhost:8088/graphql', {
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
        if (resData.errors) {
          this.setState({userAlert: resData.errors[0].message})
        } else {
          const responseAlert = JSON.stringify(resData.data).slice(0,8);
          this.setState({userAlert: responseAlert, selectedLesson: resData.data.deleteLessonTag, activityA: requestBody});
          this.context.selectedLesson = this.state.selectedLesson;
        }

        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  }
  deleteLessonRequirement = (args) => {
    console.log('...deleting lesson requirement...',args);
    this.setState({userAlert: '...adding lesson instructor ...', lessonAddField: null });
    const activityId = this.context.activityId;
    const lessonId = this.state.selectedLesson._id;
    const requirement = args;

    const requestBody = {
      query: `
          mutation {deleteLessonRequirement(
            activityId:"${activityId}",
            lessonId:"${lessonId}",
            lessonInput:{
              requirement:"${requirement}"
            })
            {_id,title,subtitle,type,category,price,sku,points,description,notes,requirements,materials,duration,files{name,type,size,path},gallery{name,type,path},schedule{date,time},gallery{name,type,path},instructors{_id,username,contact{phone,phone2,email},socialMedia{platform,handle,link},profileImages{name,type,path}},tags,reviews{_id,title,type,author{_id,username},lesson{_id,title},body,rating}}}
        `};

    fetch('http://localhost:8088/graphql', {
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
        if (resData.errors) {
          this.setState({userAlert: resData.errors[0].message})
        } else {
          const responseAlert = JSON.stringify(resData.data).slice(0,8);
          this.setState({userAlert: responseAlert, selectedLesson: resData.data.deleteLessonRequirement, activityA: requestBody});
          this.context.selectedLesson = this.state.selectedLesson;
        }

        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  }
  deleteLessonMaterial = (args) => {
    console.log('...deleting lesson material...',args);
    this.setState({userAlert: '...adding lesson instructor ...', lessonAddField: null });
    const activityId = this.context.activityId;
    const lessonId = this.state.selectedLesson._id;
    const material = args;

    const requestBody = {
      query: `
          mutation {deleteLessonMaterial(
            activityId:"${activityId}",
            lessonId:"${lessonId}",
            lessonInput:{
              material:"${material}"
            })
            {_id,title,subtitle,type,category,price,sku,points,description,notes,requirements,materials,duration,files{name,type,size,path},gallery{name,type,path},schedule{date,time},gallery{name,type,path},instructors{_id,username,contact{phone,phone2,email},socialMedia{platform,handle,link},profileImages{name,type,path}},tags,reviews{_id,title,type,author{_id,username},lesson{_id,title},body,rating}}}
        `};

    fetch('http://localhost:8088/graphql', {
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
        if (resData.errors) {
          this.setState({userAlert: resData.errors[0].message})
        } else {
          const responseAlert = JSON.stringify(resData.data).slice(0,8);
          this.setState({userAlert: responseAlert, selectedLesson: resData.data.deleteLessonMaterial, activityA: requestBody});
          this.context.selectedLesson = this.state.selectedLesson;
        }

        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  }
  deleteLessonImage = (args) => {
    console.log('...deleting lesson image...',args);
    this.setState({userAlert: '...adding lesson instructor ...', lessonAddField: null });
    const activityId = this.context.activityId;
    const lessonId = this.state.selectedLesson._id;
    const imageName = args.name;
    const imageType = args.type;
    const imagePath = args.path;

    const requestBody = {
      query: `
          mutation {deleteLessonImage(
            activityId:"${activityId}",
            lessonId:"${lessonId}",
            lessonInput:{
              imageName: "${imageName}",
              imageType: "${imageType}",
              imagePath: "${imagePath}"
            })
            {_id,title,subtitle,type,category,price,sku,points,description,notes,requirements,materials,duration,files{name,type,size,path},gallery{name,type,path},schedule{date,time},gallery{name,type,path},instructors{_id,username,contact{phone,phone2,email},socialMedia{platform,handle,link},profileImages{name,type,path}},tags,reviews{_id,title,type,author{_id,username},lesson{_id,title},body,rating}}}
        `};

    fetch('http://localhost:8088/graphql', {
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
        if (resData.errors) {
          this.setState({userAlert: resData.errors[0].message})
        } else {
          const responseAlert = JSON.stringify(resData.data).slice(0,8);
          this.setState({userAlert: responseAlert, selectedLesson: resData.data.deleteLessonImage, activityA: requestBody});
          this.context.selectedLesson = this.state.selectedLesson;
        }

        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  }
  deleteLessonFile = (args) => {
    console.log('...deleting lesson file...',args);
    this.setState({userAlert: '...adding lesson instructor ...', lessonAddField: null });
    const activityId = this.context.activityId;
    const lessonId = this.state.selectedLesson._id;

    const fileName = args.name;
    const fileType = args.type;
    const fileSize = args.size;
    const filePath = args.path;

    const requestBody = {
      query: `
          mutation {deleteLessonFile(
            activityId:"${activityId}",
            lessonId:"${lessonId}",
            lessonInput:{
              fileName: "${fileName}",
              fileType: "${fileType}",
              fileSize: "${fileSize}",
              filePath: "${filePath}"
            })
            {_id,title,subtitle,type,category,price,sku,points,description,notes,requirements,materials,duration,files{name,type,size,path},gallery{name,type,path},schedule{date,time},gallery{name,type,path},instructors{_id,username,contact{phone,phone2,email},socialMedia{platform,handle,link},profileImages{name,type,path}},tags,reviews{_id,title,type,author{_id,username},lesson{_id,title},body,rating}}}
        `};

    fetch('http://localhost:8088/graphql', {
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
        if (resData.errors) {
          this.setState({userAlert: resData.errors[0].message})
        } else {
          const responseAlert = JSON.stringify(resData.data).slice(0,8);
          this.setState({userAlert: responseAlert, selectedLesson: resData.data.deleteLessonFile, activityA: requestBody});
          this.context.selectedLesson = this.state.selectedLesson;
        }

        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  }
  deleteLessonInstructor = (args) => {
    console.log('...deleting lesson instructor...',args);
    this.setState({userAlert: '...adding lesson instructor ...', lessonAddField: null });
    const activityId = this.context.activityId;
    const lessonId = this.state.selectedLesson._id;
    const instructorId = args._id;

    const requestBody = {
      query: `
          mutation {deleteLessonInstructor(
            activityId:"${activityId}",
            lessonId:"${lessonId}",
            instructorId: "${instructorId}"
          )
            {_id,title,subtitle,type,category,price,sku,points,description,notes,requirements,materials,duration,files{name,type,size,path},gallery{name,type,path},schedule{date,time},gallery{name,type,path},instructors{_id,username,contact{phone,phone2,email},socialMedia{platform,handle,link},profileImages{name,type,path}},tags,reviews{_id,title,type,author{_id,username},lesson{_id,title},body,rating}}}
        `};

    fetch('http://localhost:8088/graphql', {
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
        if (resData.errors) {
          this.setState({userAlert: resData.errors[0].message})
        } else {
          const responseAlert = JSON.stringify(resData.data).slice(0,8);
          this.setState({userAlert: responseAlert, selectedLesson: resData.data.deleteLessonInstructor, activityA: requestBody});
          this.context.selectedLesson = this.state.selectedLesson;
        }

        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  }

  viewCalendarSessionDetail = (args) => {
    console.log('...viewCalendarSessionDetail..');
    let preSession = args.event.extendedProps.props;
    const calendarSession = {
      title: preSession.title,
      date: preSession.date,
      endDate: preSession.endDate,
      lessonId: preSession.lessonId,
      lessonTitle: preSession.lessonTitle,
      lessonInstructors: preSession.lessonInstructors,
      time: preSession.time,
      limit: preSession.limit,
      amount: preSession.amount,
      booked: preSession.booked,
      bookedAmount: preSession.bookedAmount,
      attended: preSession.attended,
      attendedAmount: preSession.attendedAmount,
      inProgress: preSession.inProgress,
      full: preSession.full,
      url: preSession.url,
    }
    this.setState({
      sessionDetailViewer: true,
      calendarSession: calendarSession,
    })
  }
  hideCalendarSessionDetail = () => {
    this.setState({
      sessionDetailViewer: false

    })
  }
  toggleSessions = (args) => {
    if (this.state.sessionsLoaded === true ) {
      this.setState({sessionsLoaded: false})
    } else {
      this.loadSessions(args);
    }
  }

  toggleOverlay = () => {
    if (this.state.overlay === true ) {
      this.setState({overlay: false})
    } else {
      this.setState({overlay: true})
    }
  }
  setFilter = (args) => {
    // console.log('...set filter...',{...args});
    this.setState({filter: {
      field: args.field,
      key: args.key,
      value: args.value
    }});
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
          user={this.context.user}
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

          showScheduleState={this.state.showScheduleState}
          toggleSchedule={this.toggleSchedule}

          showSessionBooked={this.showSessionBooked}
          showSessionAttended={this.showSessionAttended}
          hideSessionBooked={this.hideSessionBooked}
          hideSessionAttended={this.hideSessionAttended}
          sessionBookedState={this.state.sessionBookedState}
          sessionAttendedState={this.state.sessionAttendedState}

          toggleInstructors={this.toggleInstructors}
          showInstructorsState={this.state.showInstructorsState}
          toggleRequirements={this.toggleRequirements}
          showRequirementsState={this.state.showRequirementsState}
          toggleMaterials={this.toggleMaterials}
          showMaterialsState={this.state.showMaterialsState}
          toggleReviews={this.toggleReviews}
          showReviewsState={this.state.showReviewsState}

          toggleTags={this.toggleTags}
          showTagsState={this.state.showTagsState}
          toggleImages={this.toggleImages}
          showImagesState={this.state.showImagesState}
          toggleFiles={this.toggleFiles}
          showFilesState={this.state.showFilesState}

          startLessonAdd={this.startLessonAdd}
          cancelLessonAdd={this.cancelLessonAdd}
          lessonAddField={this.state.lessonAddField}
          addLessonMaterials={this.addLessonMaterials}
          addLessonRequirements={this.addLessonRequirements}
          addLessonTags={this.addLessonTags}
          addLessonImage={this.addLessonImage}
          addLessonFile={this.addLessonFile}
          selectedInstructor={this.context.selectedUser}
          addLessonInstructor={this.addLessonInstructor}

          onLikeLesson={this.likeLesson}
          deleteLessonTag={this.deleteLessonTag}
          deleteLessonRequirement={this.deleteLessonRequirement}
          deleteLessonMaterial={this.deleteLessonMaterial}
          deleteLessonImage={this.deleteLessonImage}
          deleteLessonFile={this.deleteLessonFile}
          deleteLessonInstructor={this.deleteLessonInstructor}

          viewCalendarSessionDetail={this.viewCalendarSessionDetail}
          sessionDetailViewer={this.state.sessionDetailViewer}
          calendarSession={this.state.calendarSession}
          hideCalendarSessionDetail={this.hideCalendarSessionDetail}

          toggleSessions={this.toggleSessions}
          filter={this.state.filter}
          setFilter={this.setFilter}
        />
      )}

      {this.state.overlay === true && (
        <LoadingOverlay
          status={this.state.overlayStatus}
          toggleOverlay={this.toggleOverlay}
        />
      )}



      <Accordion>

        <Row>
        {
          // <SidebarControl
          //   onShowSidebar={this.showSidebar}
          //   onHideSidebar={this.hideSidebar}
          //   toggleOverlay={this.toggleOverlay}
          // />
        // <Col md={2} className="MasterCol1">
        // <SidebarPage
        //   you={this.context.user}
        //   authId={this.context.activityId}
        // />
        // </Col>
        }

        <Col className="MasterCol2">
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
                      {
                      //   <Nav.Item>
                      //   <Nav.Link eventKey="Create">+ Lesson</Nav.Link>
                      // </Nav.Item>
                    }
                    </Nav>
                  </Col>

                  <Col sm={10} className="userListMainCol">
                    <Tab.Content>

                      {this.state.lessons !== [] && (
                      <Tab.Pane eventKey="MasterList">

                      <Row className="filterRow">
                      <Button variant="primary" onClick={this.setFilter.bind(this, {field: 'lessonMasterList', key: 'public', value: true})}>
                        Filter Public: true
                      </Button>
                      <Button variant="primary" onClick={this.setFilter.bind(this, {field: 'lessonMasterList', key: 'public', value: false})}>
                        Filter Public: false
                      </Button>
                      <Button variant="primary" onClick={this.setFilter.bind(this, {field: 'lessonMasterList', key: 'title', value: 'Ascending'})}>
                        Filter Title: Ascending
                      </Button>
                      <Button variant="primary" onClick={this.setFilter.bind(this, {field: 'lessonMasterList', key: 'title', value: 'Descending'})}>
                        Filter Title: Descending
                      </Button>
                      <Button variant="primary" onClick={this.setFilter.bind(this, {field: 'lessonMasterList', key: 'subtitle', value: 'Ascending'})}>
                        Filter Subtitle: Ascending
                      </Button>
                      <Button variant="primary" onClick={this.setFilter.bind(this, {field: 'lessonMasterList', key: 'subtitle', value: 'Descending'})}>
                        Filter Subtitle: Descending
                      </Button>
                      <Button variant="primary" onClick={this.setFilter.bind(this, {field: 'lessonMasterList', key: 'category', value: 'Ascending'})}>
                        Filter Category: Ascending
                      </Button>
                      <Button variant="primary" onClick={this.setFilter.bind(this, {field: 'lessonMasterList', key: 'category', value: 'Descending'})}>
                        Filter Category: Descending
                      </Button>
                      <Button variant="primary" onClick={this.setFilter.bind(this, {field: 'lessonMasterList', key: 'type', value: 'OneTime'})}>
                        Filter Type: OneTime
                      </Button>
                      <Button variant="primary" onClick={this.setFilter.bind(this, {field: 'lessonMasterList', key: 'type', value: 'Recurring'})}>
                        Filter Type: Recurring
                      </Button>
                      <Button variant="primary" onClick={this.setFilter.bind(this, {field: 'lessonMasterList', key: 'subType', value: 'OneDay'})}>
                        Filter Subtype: OneDay
                      </Button>
                      <Button variant="primary" onClick={this.setFilter.bind(this, {field: 'lessonMasterList', key: 'subType', value: 'MultiDay'})}>
                        Filter Subtype: MultiDay
                      </Button>
                      <Button variant="danger" onClick={this.setFilter.bind(this, {field: null, key: null, value: null })}>
                        clearFilter
                      </Button>
                      </Row>

                        <Row className="userListRow">



                         {this.state.isLoading ? (
                           <LoadingOverlay
                             status='lessons'
                           />
                         ) : (
                           <LessonList
                            canReport={this.state.canReport}
                            onReport={this.reportLesson}
                             lessons={this.state.lessons}
                             authId={this.context.activityId}
                             onViewDetail={this.showDetailHandler}
                             onSelectNoDetail={this.selectLessonNoDetail}
                             filter={this.state.filter}
                           />
                         )}
                        </Row>
                      </Tab.Pane>
                      )}

                      <Tab.Pane eventKey="SearchInput">
                        <Container className="containerSearchUserInput1">

                        <Row className="searchUserRowForm1">
                        <Col md={10} className="searchUserColForm">
                        <Tabs defaultActiveKey="Field" id="uncontrolled-tab-example">

                        <Tab eventKey="Field" title="Search by Field:">
                          <SearchLessonFieldRegexForm
                          authId={this.context.activityId}
                          canCancel
                            canConfirm
                            onCancel={this.modalCancelHandler}
                            onConfirm={this.modalConfirmSearchRegexHandler}
                            confirmText="Search"
                          />
                          <SearchLessonFieldBasicForm
                          authId={this.context.activityId}
                          canCancel
                            canConfirm
                            onCancel={this.modalCancelHandler}
                            onConfirm={this.modalConfirmSearchBasicHandler}
                            confirmText="Search"
                          />
                        </Tab>

                        <Tab eventKey="Session" title="Search Session">

                          {this.state.selectedLesson === null && (
                            <p>Select a lesson 1st</p>
                          )}

                          {this.state.selectedLesson !== null && (
                            <SearchLessonSessionForm
                            authId={this.context.activityId}
                            canCancel
                            canConfirm
                            onCancel={this.modalCancelHandler}
                            onConfirm={this.modalConfirmSearchSessionHandler}
                            lesson={this.state.selectedLesson}
                            confirmText="Search"
                          />)}

                          {this.state.searchSession !== null && (
                            <SearchSession
                            authId={this.context.activityId}
                            session={this.state.searchSession}
                            />
                          )}
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

                        <Row className="filterRow">
                          <Button variant="primary" onClick={this.setFilter.bind(this, {field: 'lessonSearchList', key: 'public', value: true})}>
                            Filter Public: true
                          </Button>
                          <Button variant="primary" onClick={this.setFilter.bind(this, {field: 'lessonSearchList', key: 'public', value: false})}>
                            Filter Public: false
                          </Button>
                          <Button variant="primary" onClick={this.setFilter.bind(this, {field: 'lessonSearchList', key: 'title', value: 'Ascending'})}>
                            Filter Title: Ascending
                          </Button>
                          <Button variant="primary" onClick={this.setFilter.bind(this, {field: 'lessonSearchList', key: 'title', value: 'Descending'})}>
                            Filter Title: Descending
                          </Button>
                          <Button variant="primary" onClick={this.setFilter.bind(this, {field: 'lessonSearchList', key: 'subtitle', value: 'Ascending'})}>
                            Filter Subtitle: Ascending
                          </Button>
                          <Button variant="primary" onClick={this.setFilter.bind(this, {field: 'lessonSearchList', key: 'subtitle', value: 'Descending'})}>
                            Filter Subtitle: Descending
                          </Button>
                          <Button variant="primary" onClick={this.setFilter.bind(this, {field: 'lessonSearchList', key: 'category', value: 'Ascending'})}>
                            Filter Category: Ascending
                          </Button>
                          <Button variant="primary" onClick={this.setFilter.bind(this, {field: 'lessonSearchList', key: 'category', value: 'Descending'})}>
                            Filter Category: Descending
                          </Button>
                          <Button variant="primary" onClick={this.setFilter.bind(this, {field: 'lessonSearchList', key: 'type', value: 'OneTime'})}>
                            Filter Type: OneTime
                          </Button>
                          <Button variant="primary" onClick={this.setFilter.bind(this, {field: 'lessonSearchList', key: 'type', value: 'Recurring'})}>
                            Filter Type: Recurring
                          </Button>
                          <Button variant="primary" onClick={this.setFilter.bind(this, {field: 'lessonSearchList', key: 'subType', value: 'OneDay'})}>
                            Filter Subtype: OneDay
                          </Button>
                          <Button variant="primary" onClick={this.setFilter.bind(this, {field: 'lessonSearchList', key: 'subType', value: 'MultiDay'})}>
                            Filter Subtype: MultiDay
                          </Button>
                          <Button variant="danger" onClick={this.setFilter.bind(this, {field: null, key: null, value: null })}>
                            clearFilter
                          </Button>
                        </Row>

                        {this.state.searchLessons !== [] && (
                          <SearchLessonList
                            lessons={this.state.searchLessons}
                            canReport={this.state.canReport}
                            onReport={this.reportLesson}
                             authId={this.context.activityId}
                             onViewDetail={this.showDetailHandler}
                             onSelectNoDetail={this.selectLessonNoDetail}
                             filter={this.state.filter}
                          />
                        )}
                        </Row>

                        </Container>
                      </Tab.Pane>

                      {
                      //   <Tab.Pane eventKey="Create">
                      //   <Button variant="outline-primary" size="lg" className="confirmEditButton" onClick={this.startCreateLesson}>+ Lesson</Button>
                      //
                      //   <Row className="userListRow">
                      //     {this.state.creating === true && (
                      //       <CreateLessonForm
                      //         authId={this.context.activityId}
                      //         creator={this.context.user}
                      //         canCancel
                      //           canConfirm
                      //           onCancel={this.modalCancelHandler}
                      //           onConfirm={this.createLessonHandler}
                      //       />
                      //     )}
                      //   </Row>
                      // </Tab.Pane>
                    }
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
