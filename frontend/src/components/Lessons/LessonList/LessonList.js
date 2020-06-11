import React from 'react';

import LessonItem from './LessonItem/LessonItem';
import './UserList.css';

const lessonList = props => {

  const {...filter} = props.filter;
  let lessons2 = props.lessons;
  let propsLessons = [];

  if (filter.field === 'lessonMasterList' && filter.key === 'public') {
    propsLessons = lessons2.filter(x => x.public === filter.value);
    // console.log('...no lessons filter...'+filter.key+'...'+filter.value);
    // console.log('lessons2',lessons2);
    // console.log('propsLessons',propsLessons);
    // console.log('props.lessons',props.lessons);
  }
  if (filter.field === 'lessonMasterList' && filter.key === 'title' && filter.value === 'Ascending') {
    propsLessons = lessons2.sort((a, b) => (a.title > b.title) ? 1 : -1);
    // console.log('...no lessons filter...'+filter.key+'...'+filter.value);
    // console.log('lessons2',lessons2);
    // console.log('propsLessons',propsLessons);
    // console.log('props.lessons',props.lessons);
  }
  if (filter.field === 'lessonMasterList' && filter.key === 'title' && filter.value === 'Descending') {
    propsLessons = lessons2.sort((a, b) => (a.title < b.title) ? 1 : -1);
    // console.log('...no lessons filter...'+filter.key+'...'+filter.value);
    // console.log('lessons2',lessons2);
    // console.log('propsLessons',propsLessons);
    // console.log('props.lessons',props.lessons);
  }
  if (filter.field === 'lessonMasterList' && filter.key === 'subtitle' && filter.value === 'Ascending') {
    propsLessons = lessons2.sort((a, b) => (a.subtitle > b.subtitle) ? 1 : -1);
    // console.log('...no lessons filter...'+filter.key+'...'+filter.value);
    // console.log('lessons2',lessons2);
    // console.log('propsLessons',propsLessons);
    // console.log('props.lessons',props.lessons);
  }
  if (filter.field === 'lessonMasterList' && filter.key === 'subtitle' && filter.value === 'Descending') {
    propsLessons = lessons2.sort((a, b) => (a.subtitle < b.subtitle) ? 1 : -1);
    // console.log('...no lessons filter...'+filter.key+'...'+filter.value);
    // console.log('lessons2',lessons2);
    // console.log('propsLessons',propsLessons);
    // console.log('props.lessons',props.lessons);
  }
  if (filter.field === 'lessonMasterList' && filter.key === 'category' && filter.value === 'Ascending') {
    propsLessons = lessons2.sort((a, b) => (a.category > b.category) ? 1 : -1);
    // console.log('...no lessons filter...'+filter.key+'...'+filter.value);
    // console.log('lessons2',lessons2);
    // console.log('propsLessons',propsLessons);
    // console.log('props.lessons',props.lessons);
  }
  if (filter.field === 'lessonMasterList' && filter.key === 'category' && filter.value === 'Descending') {
    propsLessons = lessons2.sort((a, b) => (a.category < b.category) ? 1 : -1);
    // console.log('...no lessons filter...'+filter.key+'...'+filter.value);
    // console.log('lessons2',lessons2);
    // console.log('propsLessons',propsLessons);
    // console.log('props.lessons',props.lessons);
  }
  if (filter.field === 'lessonMasterList' && filter.key === 'type') {
    propsLessons = lessons2.filter(x => x.type === filter.value)
    // console.log('...no lessons filter...'+filter.key+'...'+filter.value);
    // console.log('lessons2',lessons2);
    // console.log('propsLessons',propsLessons);
    // console.log('props.lessons',props.lessons);
  }
  if (filter.field === 'lessonMasterList' && filter.key === 'subType') {
    propsLessons = lessons2.filter(x => x.subType === filter.value)
    // console.log('...no lessons filter...'+filter.key+'...'+filter.value);
    // console.log('lessons2',lessons2);
    // console.log('propsLessons',propsLessons);
    // console.log('props.lessons',props.lessons);
  }
  if (filter.field !== 'lessonMasterList') {
    propsLessons = lessons2;
    // console.log('...no lessons filter...'+filter.key+'...'+filter.value);
    // console.log('lessons2',lessons2);
    // console.log('propsLessons',propsLessons);
    // console.log('props.lessons',props.lessons);
  }

  const lessons = propsLessons.map(lesson => {
    return (
      <LessonItem
        key={lesson._id}
        lesson={lesson}
        authId={props.authId}
        _id={lesson._id}
        title={lesson.title}
        public={lesson.public}
        type={lesson.type}
        subType={lesson.subType}
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
