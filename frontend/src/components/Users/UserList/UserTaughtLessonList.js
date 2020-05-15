import React from 'react';

import UserTaughtLessonItem from './UserItem/UserTaughtLessonItem';
import './UserList.css';

const userTaughtLessonList = props => {

  const taughtLessons = props.userTaughtLessons.map(taughtLesson => {
    const taughtLessonDate = new Date (taughtLesson.date.substr(0,10)*1000).toLocaleDateString().slice(0,10);;
    // console.log(taughtLesson.ref);
    return (
      <UserTaughtLessonItem
        key={taughtLesson.ref._id}
        taughtLesson={taughtLesson}
        date={taughtLessonDate}
        lesson={taughtLesson.ref}
        authId={props.authId}
        onDelete={props.onDelete}
        canDelete={props.canDelete}
        viewLessonDetails={props.viewLessonDetails}
      />
    );
  });

  return <ul className="user__list1_master">{taughtLessons}</ul>;
};

export default userTaughtLessonList;
