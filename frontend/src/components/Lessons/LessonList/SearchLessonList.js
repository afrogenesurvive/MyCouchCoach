import React from 'react';
// import Accordion from 'react-bootstrap/Accordion';
// import Button from 'react-bootstrap/Button';

import SearchLessonItem from './LessonItem/SearchLessonItem';
import './UserList.css';

const searchLessonList = props => {

  const searchLessons = props.searchLessons.map(lesson => {
    return (
      <React.Fragment>
      <SearchLessonItem
        key={lesson._id}
        userId={props.authUserId}
        _id={lesson._id}
        title={lesson.title}
        
        onDetail={props.onViewDetail}
      />
      </React.Fragment>
    );
  });
  return <ul className="user__list1_master">{searchLessons}</ul>;
};

export default searchLessonList;
