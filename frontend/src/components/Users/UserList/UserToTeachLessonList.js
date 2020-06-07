import React from 'react';

import UserToTeachLessonItem from './UserItem/UserToTeachLessonItem';
import './UserList.css';

const userToTeachLessonList = props => {
  // console.log('props.userToTeachLessons',props.userToTeachLessons)
  const {...filter} = props.filter;
  let userToTeachLessons2 = props.userToTeachLessons;
  let propsUserToTeachLessons = [];

  if (filter.field === 'toTeachLessons' && filter.key === 'title' && filter.value === 'Ascending') {
    propsUserToTeachLessons = userToTeachLessons2.sort((a, b) => (a.title > b.title) ? 1 : -1);
    // console.log('...filter toTeachLesson  by...'+filter.key+'...'+filter.value);
    // console.log('userToTeachLessons2',userToTeachLessons2);
    // console.log('propsUserToTeachLessons',propsUserToTeachLessons);
    // console.log('props.userToTeachLessons',props.userToTeachLessons);
  }
  if (filter.field === 'toTeachLessons' && filter.key === 'title' && filter.value === 'Descending') {
    propsUserToTeachLessons = userToTeachLessons2.sort((a, b) => (a.title < b.title) ? 1 : -1);
    // console.log('...filter toTeachLesson  by...'+filter.key+'...'+filter.value);
    // console.log('userToTeachLessons2',userToTeachLessons2);
    // console.log('propsUserToTeachLessons',propsUserToTeachLessons);
    // console.log('props.userToTeachLessons',props.userToTeachLessons);
  }
  if (filter.field === 'toTeachLessons' && filter.key === 'type' && filter.value === 'OneTime') {
    propsUserToTeachLessons = userToTeachLessons2.filter(x => x.type === filter.value);
    // console.log('...filter toTeachLesson  by...'+filter.key+'...'+filter.value);
    // console.log('userToTeachLessons2',userToTeachLessons2);
    // console.log('propsUserToTeachLessons',propsUserToTeachLessons);
    // console.log('props.userToTeachLessons',props.userToTeachLessons);
  }
  if (filter.field === 'toTeachLessons' && filter.key === 'type' && filter.value === 'Recurring') {
    propsUserToTeachLessons = userToTeachLessons2.filter(x => x.type === filter.value);
    // console.log('...filter toTeachLesson  by...'+filter.key+'...'+filter.value);
    // console.log('userToTeachLessons2',userToTeachLessons2);
    // console.log('propsUserToTeachLessons',propsUserToTeachLessons);
    // console.log('props.userToTeachLessons',props.userToTeachLessons);
  }
  if (filter.field === 'toTeachLessons' && filter.key === 'subType' && filter.value === 'OneDay') {
    propsUserToTeachLessons = userToTeachLessons2.filter(x => x.subType === filter.value);
    // console.log('...filter toTeachLesson  by...'+filter.key+'...'+filter.value);
    // console.log('userToTeachLessons2',userToTeachLessons2);
    // console.log('propsUserToTeachLessons',propsUserToTeachLessons);
    // console.log('props.userToTeachLessons',props.userToTeachLessons);
  }
  if (filter.field === 'toTeachLessons' && filter.key === 'subType' && filter.value === 'MultiDay') {
    propsUserToTeachLessons = userToTeachLessons2.filter(x => x.subType === filter.value);
    // console.log('...filter toTeachLesson  by...'+filter.key+'...'+filter.value);
    // console.log('userToTeachLessons2',userToTeachLessons2);
    // console.log('propsUserToTeachLessons',propsUserToTeachLessons);
    // console.log('props.userToTeachLessons',props.userToTeachLessons);
  }
  if (filter.field === 'toTeachLessons' && filter.key === 'public' && filter.value === true) {
    propsUserToTeachLessons = userToTeachLessons2.filter(x => x.public === filter.value);
    // console.log('...filter toTeachLesson  by...'+filter.key+'...'+filter.value);
    // console.log('userToTeachLessons2',userToTeachLessons2);
    // console.log('propsUserToTeachLessons',propsUserToTeachLessons);
    // console.log('props.userToTeachLessons',props.userToTeachLessons);
  }
  if (filter.field === 'toTeachLessons' && filter.key === 'public' && filter.value === false) {
    propsUserToTeachLessons = userToTeachLessons2.filter(x => x.public === filter.value);
    // console.log('...filter toTeachLesson  by...'+filter.key+'...'+filter.value);
    // console.log('userToTeachLessons2',userToTeachLessons2);
    // console.log('propsUserToTeachLessons',propsUserToTeachLessons);
    // console.log('props.userToTeachLessons',props.userToTeachLessons);
  }
  if (filter.field !== 'toTeachLessons') {
    propsUserToTeachLessons = userToTeachLessons2;
    // console.log('...no toTeachLesson filter...'+filter.key+'...'+filter.value);
    // console.log('userToTeachLessons2',userToTeachLessons2);
    // console.log('propsUserToTeachLessons',propsUserToTeachLessons);
    // console.log('props.userToTeachLessons',props.userToTeachLessons);
  }

  const toTeachLessons = propsUserToTeachLessons.map(toTeachLesson => {
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
