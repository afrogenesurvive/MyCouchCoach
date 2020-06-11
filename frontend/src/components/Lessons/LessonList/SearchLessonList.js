import React from 'react';
// import Accordion from 'react-bootstrap/Accordion';
// import Button from 'react-bootstrap/Button';

import SearchLessonItem from './LessonItem/SearchLessonItem';
import './UserList.css';

const searchLessonList = props => {

  const {...filter} = props.filter;
  let lessons2 = props.lessons;
  let propsLessons = [];

  if (filter.field === 'lessonSearchList' && filter.key === 'public') {
    propsLessons = lessons2.filter(x => x.public === filter.value);
    // console.log('...no lessons filter...'+filter.key+'...'+filter.value);
    // console.log('lessons2',lessons2);
    // console.log('propsLessons',propsLessons);
    // console.log('props.lessons',props.lessons);
  }
  if (filter.field === 'lessonSearchList' && filter.key === 'title' && filter.value === 'Ascending') {
    propsLessons = lessons2.sort((a, b) => (a.title > b.title) ? 1 : -1);
    // console.log('...no lessons filter...'+filter.key+'...'+filter.value);
    // console.log('lessons2',lessons2);
    // console.log('propsLessons',propsLessons);
    // console.log('props.lessons',props.lessons);
  }
  if (filter.field === 'lessonSearchList' && filter.key === 'title' && filter.value === 'Descending') {
    propsLessons = lessons2.sort((a, b) => (a.title < b.title) ? 1 : -1);
    // console.log('...no lessons filter...'+filter.key+'...'+filter.value);
    // console.log('lessons2',lessons2);
    // console.log('propsLessons',propsLessons);
    // console.log('props.lessons',props.lessons);
  }
  if (filter.field === 'lessonSearchList' && filter.key === 'subtitle' && filter.value === 'Ascending') {
    propsLessons = lessons2.sort((a, b) => (a.subtitle > b.subtitle) ? 1 : -1);
    // console.log('...no lessons filter...'+filter.key+'...'+filter.value);
    // console.log('lessons2',lessons2);
    // console.log('propsLessons',propsLessons);
    // console.log('props.lessons',props.lessons);
  }
  if (filter.field === 'lessonSearchList' && filter.key === 'subtitle' && filter.value === 'Descending') {
    propsLessons = lessons2.sort((a, b) => (a.subtitle < b.subtitle) ? 1 : -1);
    // console.log('...no lessons filter...'+filter.key+'...'+filter.value);
    // console.log('lessons2',lessons2);
    // console.log('propsLessons',propsLessons);
    // console.log('props.lessons',props.lessons);
  }
  if (filter.field === 'lessonSearchList' && filter.key === 'category' && filter.value === 'Ascending') {
    propsLessons = lessons2.sort((a, b) => (a.category > b.category) ? 1 : -1);
    // console.log('...no lessons filter...'+filter.key+'...'+filter.value);
    // console.log('lessons2',lessons2);
    // console.log('propsLessons',propsLessons);
    // console.log('props.lessons',props.lessons);
  }
  if (filter.field === 'lessonSearchList' && filter.key === 'category' && filter.value === 'Descending') {
    propsLessons = lessons2.sort((a, b) => (a.category < b.category) ? 1 : -1);
    // console.log('...no lessons filter...'+filter.key+'...'+filter.value);
    // console.log('lessons2',lessons2);
    // console.log('propsLessons',propsLessons);
    // console.log('props.lessons',props.lessons);
  }
  if (filter.field === 'lessonSearchList' && filter.key === 'type') {
    propsLessons = lessons2.filter(x => x.type === filter.value)
    // console.log('...no lessons filter...'+filter.key+'...'+filter.value);
    // console.log('lessons2',lessons2);
    // console.log('propsLessons',propsLessons);
    // console.log('props.lessons',props.lessons);
  }
  if (filter.field === 'lessonSearchList' && filter.key === 'subType') {
    propsLessons = lessons2.filter(x => x.subType === filter.value)
    // console.log('...no lessons filter...'+filter.key+'...'+filter.value);
    // console.log('lessons2',lessons2);
    // console.log('propsLessons',propsLessons);
    // console.log('props.lessons',props.lessons);
  }
  if (filter.field !== 'lessonSearchList') {
    propsLessons = lessons2;
    // console.log('...no lessons filter...'+filter.key+'...'+filter.value);
    // console.log('lessons2',lessons2);
    // console.log('propsLessons',propsLessons);
    // console.log('props.lessons',props.lessons);
  }

  const searchLessons = propsLessons.map(lesson => {
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
