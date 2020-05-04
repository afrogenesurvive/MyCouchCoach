import React from 'react';

import LessonInstructorItem from './LessonItem/LessonInstructorItem';
import './UserList.css';

const lessonInstructorList = props => {

  const instructors = props.lessonInstructors.map(instructor => {
    return (
      <LessonInstructorItem
        key={instructor}
        instructor={instructor}
        _id={instructor._id}
        username={instructor.username}
        contact={instructor.contact}
        socialMedia={instructor.socialMedia}
        profileImages={instructor.profileImages}
        authId={props.authId}
        canDelete={props.canDelete}
        onDelete={props.onDelete}
      />
    );
  });

  return <ul className="user__list1_master">{instructors}</ul>;
};

export default lessonInstructorList;
