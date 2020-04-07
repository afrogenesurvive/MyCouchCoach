import React from 'react';

import UserAttendedLessonItem from './UserItem/UserAttendedLessonItem';
import './UserList.css';

const userAttendedLessonList = props => {

  const attendedLessons = props.userAttendedLessons.map(attendedLesson => {
    const attendedLessonDate = new Date (attendedLesson.date.substr(0,10)*1000).toISOString().slice(0,10);;
    return (
      <UserAttendedLessonItem
        key={attendedLesson.ref}
        bookedLesson={attendedLesson}
        date={attendedLessonDate}
        ref={attendedLesson.ref}
        authId={props.authId}
      />
    );
  });

  return <ul className="user__list1_master">{attendedLessons}</ul>;
};

export default userAttendedLessonList;
