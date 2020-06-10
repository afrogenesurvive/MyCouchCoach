import React from 'react';

import UserTaughtLessonItem from './UserItem/UserTaughtLessonItem';
import './UserList.css';

const userTaughtLessonList = props => {

  let key = null;
  const {...filter} = props.filter;
  let userTaughtLessons2 = props.userTaughtLessons;
  let propsUserTaughtLessons = [];

  if (filter.field === 'taughtLessons' && filter.key === 'date' && filter.value === 'Ascending') {
    propsUserTaughtLessons = userTaughtLessons2.sort((a, b) => (a.date > b.date) ? 1 : -1);
    // console.log('...no bookedLesson filter...'+filter.key+'...'+filter.value);
    // console.log('userTaughtLessons2',userTaughtLessons2);
    // console.log('propsUserTaughtLessons',propsUserTaughtLessons);
    // console.log('props.userTaughtLessons',props.userTaughtLessons);
  }
  if (filter.field === 'taughtLessons' && filter.key === 'date' && filter.value === 'Descending') {
    propsUserTaughtLessons = userTaughtLessons2.sort((a, b) => (a.date < b.date) ? 1 : -1);
    // console.log('...no bookedLesson filter...'+filter.key+'...'+filter.value);
    // console.log('userTaughtLessons2',userTaughtLessons2);
    // console.log('propsUserTaughtLessons',propsUserTaughtLessons);
    // console.log('props.userTaughtLessons',props.userTaughtLessons);
  }
  if (filter.field === 'taughtLessons' && filter.key === 'lesson.title' && filter.value === 'Ascending') {
    propsUserTaughtLessons = userTaughtLessons2.sort((a, b) => (a.ref.title > b.ref.title) ? 1 : -1);
    // console.log('...no bookedLesson filter...'+filter.key+'...'+filter.value);
    // console.log('userTaughtLessons2',userTaughtLessons2);
    // console.log('propsUserTaughtLessons',propsUserTaughtLessons);
    // console.log('props.userTaughtLessons',props.userTaughtLessons);
  }
  if (filter.field === 'taughtLessons' && filter.key === 'lesson.title' && filter.value === 'Descending') {
    propsUserTaughtLessons = userTaughtLessons2.sort((a, b) => (a.ref.title < b.ref.title) ? 1 : -1);
    // console.log('...no bookedLesson filter...'+filter.key+'...'+filter.value);
    // console.log('userTaughtLessons2',userTaughtLessons2);
    // console.log('propsUserTaughtLessons',propsUserTaughtLessons);
    // console.log('props.userTaughtLessons',props.userTaughtLessons);
  }
  if (filter.field === 'taughtLessons' && filter.key === 'type') {
    propsUserTaughtLessons = userTaughtLessons2.filter(x => x.ref.type === filter.value);
    // console.log('...no bookedLesson filter...'+filter.key+'...'+filter.value);
    // console.log('userTaughtLessons2',userTaughtLessons2);
    // console.log('propsUserTaughtLessons',propsUserTaughtLessons);
    // console.log('props.userTaughtLessons',props.userTaughtLessons);
  }
  if (filter.field === 'taughtLessons' && filter.key === 'subType') {
    propsUserTaughtLessons = userTaughtLessons2.filter(x => x.ref.subType === filter.value);
    // console.log('...no bookedLesson filter...'+filter.key+'...'+filter.value);
    // console.log('userTaughtLessons2',userTaughtLessons2);
    // console.log('propsUserTaughtLessons',propsUserTaughtLessons);
    // console.log('props.userTaughtLessons',props.userTaughtLessons);
  }
  if (filter.field === 'taughtLessons' && filter.key === 'public') {
    propsUserTaughtLessons = userTaughtLessons2.filter(x => x.ref.public === filter.value);
    // console.log('...no bookedLesson filter...'+filter.key+'...'+filter.value);
    // console.log('userTaughtLessons2',userTaughtLessons2);
    // console.log('propsUserTaughtLessons',propsUserTaughtLessons);
    // console.log('props.userTaughtLessons',props.userTaughtLessons);
  }
  if (filter.field !== 'taughtLessons') {
    propsUserTaughtLessons = userTaughtLessons2;
    // console.log('...no bookedLesson filter...'+filter.key+'...'+filter.value);
    // console.log('userTaughtLessons2',userTaughtLessons2);
    // console.log('propsUserTaughtLessons',propsUserTaughtLessons);
    // console.log('props.userTaughtLessons',props.userTaughtLessons);
  }

  const taughtLessons = propsUserTaughtLessons.map(taughtLesson => {
    const taughtLessonDate = new Date (taughtLesson.date.substr(0,10)*1000).toLocaleDateString().slice(0,10);;
    // console.log(taughtLesson.ref);
    key = taughtLesson.ref._id;
    return (
      <UserTaughtLessonItem
        key={key}
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
