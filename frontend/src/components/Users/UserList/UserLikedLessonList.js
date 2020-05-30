import React from 'react';

import UserLikedLessonItem from './UserItem/UserLikedLessonItem';
import './UserList.css';

const userLikedLessonList = props => {
  // console.log(props.userLikedLessons)
  const {...filter} = props.filter;
  let userLikedLessons2 = props.userLikedLessons;
  let propsUserLikedLessons = [];

  if (filter.field === 'likedLessons' && filter.key === 'title' && filter.value === 'Ascending') {
    propsUserLikedLessons = userLikedLessons2.sort((a, b) => (a.title > b.title) ? 1 : -1);
    console.log('...filter likedLesson by...'+filter.key+'...'+filter.value);
    console.log('userLikedLessons2',userLikedLessons2);
    console.log('propsUserLikedLessons',propsUserLikedLessons);
    console.log('props.userLikedLessons',props.userLikedLessons);
  }
  if (filter.field === 'likedLessons' && filter.key === 'title' && filter.value === 'Descending') {
    propsUserLikedLessons = userLikedLessons2.sort((a, b) => (a.title < b.title) ? 1 : -1);
    console.log('...filter likedLesson by...'+filter.key+'...'+filter.value);
    console.log('userLikedLessons2',userLikedLessons2);
    console.log('propsUserLikedLessons',propsUserLikedLessons);
    console.log('props.userLikedLessons',props.userLikedLessons);
  }
  if (filter.field === 'likedLessons' && filter.key === 'type') {
    propsUserLikedLessons = userLikedLessons2.filter(x => x.type === filter.value)
    console.log('...filter likedLesson by...'+filter.key+'...'+filter.value);
    console.log('userLikedLessons2',userLikedLessons2);
    console.log('propsUserLikedLessons',propsUserLikedLessons);
    console.log('props.userLikedLessons',props.userLikedLessons);
  }
  if (filter.field === 'likedLessons' && filter.key === 'subType') {
    propsUserLikedLessons = userLikedLessons2.filter(x => x.subType === filter.value)
    console.log('...filter likedLesson by...'+filter.key+'...'+filter.value);
    console.log('userLikedLessons2',userLikedLessons2);
    console.log('propsUserLikedLessons',propsUserLikedLessons);
    console.log('props.userLikedLessons',props.userLikedLessons);
  }
  if (filter.field === 'likedLessons' && filter.key === 'public') {
    propsUserLikedLessons = userLikedLessons2.filter(x => x.public === filter.value)
    console.log('...filter likedLesson by...'+filter.key+'...'+filter.value);
    console.log('userLikedLessons2',userLikedLessons2);
    console.log('propsUserLikedLessons',propsUserLikedLessons);
    console.log('props.userLikedLessons',props.userLikedLessons);
  }

  if (filter.field !== 'likedLessons') {
    propsUserLikedLessons = userLikedLessons2;
    console.log('...no likedLesson filter...'+filter.key+'...'+filter.value);
    console.log('userLikedLessons2',userLikedLessons2);
    console.log('propsUserLikedLessons',propsUserLikedLessons);
    console.log('props.userLikedLessons',props.userLikedLessons);
  }

  const likedLessons = propsUserLikedLessons.map(likedLesson => {
    return (
      <UserLikedLessonItem
        key={likedLesson._id}
        likedLesson={likedLesson}
        _id={likedLesson._id}
        title={likedLesson.title}
        type={likedLesson.type}
        subType={likedLesson.subType}
        public={likedLesson.public}
        authId={props.authId}
        onDelete={props.onDelete}
        canDelete={props.canDelete}
        viewLessonDetails={props.viewLessonDetails}
      />
    );
  });

  return <ul className="user__list1_master">{likedLessons}</ul>;
};

export default userLikedLessonList;
