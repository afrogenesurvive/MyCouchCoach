import React from 'react';

import UserBookedLessonItem from './UserItem/UserBookedLessonItem';
import './UserList.css';

const userBookedLessonList = props => {

  const {...filter} = props.filter;
  let userBookedLessons2 = props.userBookedLessons;
  let x = [];

  if (filter.field === 'bookedLessons' && filter.key === 'public' ) {
    x = userBookedLessons2.filter(x => x.ref.public === filter.value);
    console.log('...filter bookedLesson by...'+filter.key+'...'+filter.value);
    console.log("x", x);
    // console.log('userBookedLessons2',userBookedLessons2);
    // console.log('propsUserBookedLessons',propsUserBookedLessons);
    // console.log('props.userBookedLessons',props.userBookedLessons);
  }
  if (filter.field === 'bookedLessons' && filter.key === 'date' && filter.value === 'Ascending') {
    x = userBookedLessons2.sort((a, b) => (a.date < b.date) ? 1 : -1);
    console.log('...filter bookedLesson by...'+filter.key+'...'+filter.value);
    console.log("x", x);
    // console.log('userBookedLessons2',userBookedLessons2);
    // console.log('propsUserBookedLessons',propsUserBookedLessons);
    // console.log('props.userBookedLessons',props.userBookedLessons);
  }
  if (filter.field === 'bookedLessons' && filter.key === 'date' && filter.value === 'Descending') {
    x = userBookedLessons2.sort((a, b) => (new Date(a.date.substr(0,10)*1000).toISOString().slice(0,10) > new Date(b.date.substr(0,10)*1000).toISOString().slice(0,10)) ? 1 : -1);
    console.log('...filter bookedLesson by...'+filter.key+'...'+filter.value);
    console.log("x", x);
    // console.log('userBookedLessons2',userBookedLessons2);
    // console.log('propsUserBookedLessons',propsUserBookedLessons);
    // console.log('props.userBookedLessons',props.userBookedLessons);
  }
  if (filter.field === 'bookedLessons' && filter.key === 'title' && filter.value === 'Ascending') {
    x = userBookedLessons2.sort((a, b) => (a.ref.title < b.ref.title) ? 1 : -1);
    console.log('...filter bookedLesson by...'+filter.key+'...'+filter.value);
    console.log("x", x);
    // console.log('userBookedLessons2',userBookedLessons2);
    // console.log('propsUserBookedLessons',propsUserBookedLessons);
    // console.log('props.userBookedLessons',props.userBookedLessons);
  }
  if (filter.field === 'bookedLessons' && filter.key === 'title' && filter.value === 'Descending') {
    x = userBookedLessons2.sort((a, b) => (a.ref.title > b.ref.title) ? 1 : -1);
    console.log('...filter bookedLesson by...'+filter.key+'...'+filter.value);
    console.log("x", x);
    // console.log('userBookedLessons2',userBookedLessons2);
    // console.log('propsUserBookedLessons',propsUserBookedLessons);
    // console.log('props.userBookedLessons',props.userBookedLessons);
  }
  if (filter.field !== 'bookedLessons') {
    x = userBookedLessons2;
    console.log('...no bookedLesson filter...'+filter.key+'...'+filter.value);
    console.log("x", x);
    // console.log('userBookedLessons2',userBookedLessons2);
    // console.log('propsUserBookedLessons',propsUserBookedLessons);
    // console.log('props.userBookedLessons',props.userBookedLessons);
  }

  const bookedLessons = x.map(bookedLesson => {

    const dateBooked = new Date (bookedLesson.date.substr(0,10)*1000).toISOString().slice(0,10);;
    const sessionDate = new Date (bookedLesson.session.date.substr(0,10)*1000).toISOString().slice(0,10);
    return (
      <UserBookedLessonItem
        key={bookedLesson.ref._id}
        bookedLesson={bookedLesson}
        dateBooked={dateBooked}
        sessionDate={sessionDate}
        sessionTime={bookedLesson.session.time}
        sessionTitle={bookedLesson.session.title}
        lesson={bookedLesson.ref}
        authId={props.authId}
        onDelete={props.onDelete}
        canDelete={props.canDelete}
        viewLessonDetails={props.viewLessonDetails}
      />
    );
  });

  return <ul className="user__list1_master">{bookedLessons}</ul>;
};

export default userBookedLessonList;
