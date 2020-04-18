import React from 'react';

import UserLikedLessonItem from './UserItem/UserLikedLessonItem';
import './UserList.css';

const userLikedLessonList = props => {
  console.log(props.userLikedLessons)
  const likedLessons = props.userLikedLessons.map(likedLesson => {
    return (
      <UserLikedLessonItem
        key={likedLesson}
        likedLesson={likedLesson}
        _id={likedLesson._id}
        title={likedLesson.title}
        authId={props.authId}
        onDelete={props.onDelete}
        canDelete={props.canDelete}
      />
    );
  });

  return <ul className="user__list1_master">{likedLessons}</ul>;
};

export default userLikedLessonList;
