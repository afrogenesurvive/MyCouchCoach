import React from 'react';
// import Accordion from 'react-bootstrap/Accordion';
// import Button from 'react-bootstrap/Button';

import SearchLessonItem from './LessonItem/SearchLessonItem';
import './UserList.css';

const searchLessonList = props => {

  const searchLessons = props.lessons.map(lesson => {
    return (
      <React.Fragment>
      <SearchLessonItem
        key={lesson._id}
        lesson={lesson}
        userId={props.authUserId}
        _id={lesson._id}
        title={lesson.title}
        subtitle={lesson.subtitle}
        category={lesson.category}
        instructors={lesson.instructors}
        gallery={lesson.gallery}
        schedule={lesson.schedule}
        sessions={lesson.sessions}
        onDetail={props.onViewDetail}
        onSelectNoDetail={props.onSelectNoDetail}
        canReport={props.canReport}
        onReport={props.onReport}
      />
      </React.Fragment>
    );
  });
  return <ul className="user__list1_master">{searchLessons}</ul>;
};

export default searchLessonList;
