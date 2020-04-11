import React from 'react';

import UserTaughtLessonItem from './UserItem/UserTaughtLessonItem';
import './UserList.css';

const userTaughtLessonList = props => {

  const taughtLessons = props.userTaughtLessons.map(taughtLesson => {
    const taughtLessonDate = new Date (taughtLesson.date.substr(0,10)*1000).toISOString().slice(0,10);;
    // console.log(taughtLesson.ref);
    return (
      <UserTaughtLessonItem
        key={taughtLesson.ref}
        taughtLesson={taughtLesson}
        date={taughtLessonDate}
        ref={taughtLesson.ref}
        authId={props.authId}
        onDelete={props.onDelete}
        canDelete={props.canDelete}
      />
    );
  });

  return <ul className="user__list1_master">{taughtLessons}</ul>;
};

export default userTaughtLessonList;
