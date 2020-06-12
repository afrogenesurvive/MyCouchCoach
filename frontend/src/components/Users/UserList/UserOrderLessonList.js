import React from 'react';

import UserOrderLessonItem from './UserItem/UserOrderLessonItem';
import './UserList.css';

const userOrderLessonList = props => {

  let count = 0;

  const lessons = props.userOrderLessons.map(lesson => {

    count = props.userOrderLessons.indexOf(lesson)+1;

    const sessionDate = new Date (lesson.date.substr(0,10)*1000).toLocaleDateString().slice(0,10);

    return (
      <UserOrderLessonItem
        key={count}
        orderLesson={lesson}
        sessionDate={sessionDate}
        sessionTitle={lesson.title}
      />
    );
  });

  return <ul className="user__list1_master">{lessons}</ul>;
};

export default userOrderLessonList;
