import React from 'react';

import LessonRequirementItem from './LessonItem/LessonRequirementItem';
import './UserList.css';

const lessonRequirementList = props => {

  const {...filter} = props.filter;
  let lessonRequirements2 = props.lessonRequirements;
  let propsLessonRequirements = [];

  if (filter.field === 'lessonDetail' && filter.key === 'requirements' && filter.value === 'Ascending') {
    propsLessonRequirements = lessonRequirements2.sort((a, b) => (a > b) ? 1 : -1);
    // console.log('...no lessons schedule filter...'+filter.key+'...'+filter.value);
    // console.log('lessonRequirements2',lessonRequirements2);
    // console.log('propsLessonRequirements',propsLessonRequirements);
    // console.log('props.lessonRequirements',props.lessonRequirements);
  }
  if (filter.field === 'lessonDetail' && filter.key === 'requirements' && filter.value === 'Descending') {
    propsLessonRequirements = lessonRequirements2.sort((a, b) => (a < b) ? 1 : -1);
    // console.log('...no lessons schedule filter...'+filter.key+'...'+filter.value);
    // console.log('lessonRequirements2',lessonRequirements2);
    // console.log('propsLessonRequirements',propsLessonRequirements);
    // console.log('props.lessonRequirements',props.lessonRequirements);
  }
  if (filter.field !== 'lessonDetail' && filter.key !== 'requirements') {
    propsLessonRequirements = lessonRequirements2;
    // console.log('...no lessons schedule filter...'+filter.key+'...'+filter.value);
    // console.log('lessonRequirements2',lessonRequirements2);
    // console.log('propsLessonRequirements',propsLessonRequirements);
    // console.log('props.lessonRequirements',props.lessonRequirements);
  }

  const requirements = propsLessonRequirements.map(requirement => {
    return (
      <LessonRequirementItem
        public={props.public}
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
