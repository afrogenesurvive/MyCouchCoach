import React from 'react';

import LessonItem from './LessonItem/LessonItem';
import './UserList.css';

const lessonList = props => {

  const lessons = props.lessons.map(lesson => {
    return (
      <LessonItem
        key={lesson._id}
        lesson={lesson}
        authId={props.authId}
        _id={lesson._id}
        title={lesson.title}
        subtitle={lesson.subtitle}
        category={lesson.category}
        instructors={lesson.instructors}
        gallery={lesson.gallery}
        schedule={lesson.schedule}
        sessions={lesson.sessions}
        onSelectNoDetail={props.onSelectNoDetail}
        onDetail={props.onViewDetail}
        canReport={props.canReport}
        onReport={props.onReport}
        puplic={props.public}
      />
    );
  });

  return <ul className="user__list1_master">{lessons}</ul>;
};

export default lessonList;
