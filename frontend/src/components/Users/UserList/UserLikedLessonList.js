import React from 'react';

import UserLikedLessonItem from './UserItem/UserLikedLessonItem';
import './UserList.css';

const userLikedLessonList = props => {
  // console.log(props.userLikedLessons)
  const likedLessons = props.userLikedLessons.map(likedLesson => {
    return (
      <UserLikedLessonItem
        key={likedLesson._id}
        likedLesson={likedLesson}
        _id={likedLesson._id}
        title={likedLesson.title}
        type={likedLesson.type}
        subType={likedLesson.subType}
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
