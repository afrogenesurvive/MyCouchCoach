import React from 'react';

import UserAttendedLessonItem from './UserItem/UserAttendedLessonItem';
import './UserList.css';

const userAttendedLessonList = props => {

  const attendedLessons = props.userAttendedLessons.map(attendedLesson => {
    // console.log(attendedLesson.ref._id);
    // console.log(props.reviewedLessonIds);
    // console.log(props.reviewedLessonIds.includes(attendedLesson.ref._id.toString()));
    const hasReviewed = props.reviewedLessonIds.includes(attendedLesson.ref._id.toString());
    const attendedLessonDate = new Date (attendedLesson.date.substr(0,10)*1000).toLocaleDateString().slice(0,10);;
    return (
      <UserAttendedLessonItem
        key={attendedLesson.ref._id}
        attendedLesson={attendedLesson}
        date={attendedLessonDate}
        lesson={attendedLesson.ref}
        authId={props.authId}
        onDelete={props.onDelete}
        canDelete={props.canDelete}
        hasReviewed={hasReviewed}
        viewLessonDetails={props.viewLessonDetails}
        startCreateReview={props.startCreateReview}
      />
    );
  });

  return <ul className="user__list1_master">{attendedLessons}</ul>;
};

export default userAttendedLessonList;
