import React from 'react';

import UserBookedLessonItem from './UserItem/UserBookedLessonItem';
import './UserList.css';

const userBookedLessonList = props => {

  const bookedLessons = props.userBookedLessons.map(bookedLesson => {
    const bookedLessonDate = new Date (bookedLesson.date.substr(0,10)*1000).toISOString().slice(0,10);;
    return (
      <UserBookedLessonItem
        key={bookedLesson.ref}
        bookedLesson={bookedLesson}
        date={bookedLessonDate}
        ref={bookedLesson.ref}
        authId={props.authId}
      />
    );
  });

  return <ul className="user__list1_master">{bookedLessons}</ul>;
};

export default userBookedLessonList;
