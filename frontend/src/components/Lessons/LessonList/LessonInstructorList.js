import React from 'react';

import LessonInstructorItem from './LessonItem/LessonInstructorItem';
import './UserList.css';

const lessonInstructorList = props => {

  const {...filter} = props.filter;
  let lessonInstructors2 = props.lessonInstructors;
  let propsLessonInstructors = [];

  if (filter.field === 'lessonDetail' && filter.key === 'instructors' && filter.value === 'nameAscending') {
    propsLessonInstructors = lessonInstructors2.sort((a, b) => (a.name > b.name) ? 1 : -1);
  }
  if (filter.field === 'lessonDetail' && filter.key === 'instructors' && filter.value === 'nameDescending') {
    propsLessonInstructors = lessonInstructors2.sort((a, b) => (a.name < b.name) ? 1 : -1);
  }
  if (filter.field === 'lessonDetail' && filter.key === 'instructors' && filter.value === 'emailAscending') {
    propsLessonInstructors = lessonInstructors2.sort((a, b) => (a.contact.email > b.contact.email) ? 1 : -1);
  }
  if (filter.field === 'lessonDetail' && filter.key === 'instructors' && filter.value === 'emailDescending') {
    propsLessonInstructors = lessonInstructors2.sort((a, b) => (a.contact.email < b.contact.email) ? 1 : -1);
  }
  if (filter.field === 'lessonDetail' && filter.key === 'instructors' && filter.value === 'socialPlatformAscending') {
    propsLessonInstructors = lessonInstructors2.sort((a, b) => (a.socialMedia.platform > b.socialMedia.platform) ? 1 : -1);
  }
  if (filter.field === 'lessonDetail' && filter.key === 'instructors' && filter.value === 'socialPlatformDescending') {
    propsLessonInstructors = lessonInstructors2.sort((a, b) => (a.socialMedia.platform < b.socialMedia.platform) ? 1 : -1);
  }
  if (filter.field !== 'lessonDetail' && filter.key !== 'instructors') {
    propsLessonInstructors = lessonInstructors2;
  }

  const instructors = propsLessonInstructors.map(instructor => {
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
