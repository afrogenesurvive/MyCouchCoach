import React from 'react';

import UserToTeachLessonItem from './UserItem/UserToTeachLessonItem';
import './UserList.css';

const userToTeachLessonList = props => {
  // console.log(props.userToTeachLessons)
  const toTeachLessons = props.userToTeachLessons.map(toTeachLesson => {
    return (
      <UserToTeachLessonItem
        key={toTeachLesson}
        toTeachLesson={toTeachLesson}
        _id={toTeachLesson._id}
        title={toTeachLesson.title}
        authId={props.authId}
        viewLessonDetails={props.viewLessonDetails}
      />
    );
  });

  return <ul className="user__list1_master">{toTeachLessons}</ul>;
};

export default userToTeachLessonList;
