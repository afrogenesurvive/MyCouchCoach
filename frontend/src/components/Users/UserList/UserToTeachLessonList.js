import React from 'react';

import UserToTeachLessonItem from './UserItem/UserToTeachLessonItem';
import './UserList.css';

const userToTeachLessonList = props => {
  // console.log('props.userToTeachLessons',props.userToTeachLessons)
  const toTeachLessons = props.userToTeachLessons.map(toTeachLesson => {
    // console.log('toTeachLesson.gallery',toTeachLesson.gallery);
    return (
      <UserToTeachLessonItem
        key={toTeachLesson._id}
        toTeachLesson={toTeachLesson}
        _id={toTeachLesson._id}
        title={toTeachLesson.title}
        type={toTeachLesson.type}
        subType={toTeachLesson.subType}
        public={toTeachLesson.public}
        authId={props.authId}
        viewLessonDetails={props.viewLessonDetails}
      />
    );
  });

  return <ul className="user__list1_master">{toTeachLessons}</ul>;
};

export default userToTeachLessonList;
