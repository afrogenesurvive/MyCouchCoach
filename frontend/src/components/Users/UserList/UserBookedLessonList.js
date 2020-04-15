import React from 'react';

import UserBookedLessonItem from './UserItem/UserBookedLessonItem';
import './UserList.css';

const userBookedLessonList = props => {

  const bookedLessons = props.userBookedLessons.map(bookedLesson => {

    const dateBooked = new Date (bookedLesson.date.substr(0,10)*1000).toISOString().slice(0,10);;
    const sessionDate = new Date (bookedLesson.session.date.substr(0,10)*1000).toISOString().slice(0,10);;
    return (
      <UserBookedLessonItem
        key={bookedLesson.ref}
        bookedLesson={bookedLesson}
        dateBooked={dateBooked}
        sessionDate={sessionDate}
        sessionTime={bookedLesson.session.time}
        sessionTitle={bookedLesson.session.title}
        lesson={bookedLesson.ref}
        authId={props.authId}
        onDelete={props.onDelete}
        canDelete={props.canDelete}
      />
    );
  });

  return <ul className="user__list1_master">{bookedLessons}</ul>;
};

export default userBookedLessonList;
