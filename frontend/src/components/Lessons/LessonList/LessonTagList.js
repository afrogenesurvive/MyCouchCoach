import React from 'react';

import LessonTagItem from './LessonItem/LessonTagItem';
import './UserList.css';

const lessonTagList = props => {

  const tags = props.lessonTags.map(tag => {
    return (
      <LessonTagItem
        key={tag}
        tag={tag}
        authId={props.authId}
        canDelete={props.canDelete}
        onDelete={props.onDelete}
      />
    );
  });

  return <ul className="user__list1_master">{tags}</ul>;
};

export default lessonTagList;
