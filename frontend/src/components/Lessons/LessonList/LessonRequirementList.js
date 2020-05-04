import React from 'react';

import LessonRequirementItem from './LessonItem/LessonRequirementItem';
import './UserList.css';

const lessonRequirementList = props => {

  const requirements = props.lessonRequirements.map(requirement => {
    return (
      <LessonRequirementItem
        key={requirement}
        requirement={requirement}
        authId={props.authId}
        canDelete={props.canDelete}
        onDelete={props.onDelete}
      />
    );
  });

  return <ul className="user__list1_master">{requirements}</ul>;
};

export default lessonRequirementList;
