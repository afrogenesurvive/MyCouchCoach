import React from 'react';

import LessonTagItem from './LessonItem/LessonTagItem';
import './UserList.css';

const lessonTagList = props => {

  const {...filter} = props.filter;
  let lessonTags2 = props.lessonTags;
  let propsLessonTags = [];

  if (filter.field === 'lessonDetail' && filter.key === 'tags' && filter.value === 'Ascending') {
    propsLessonTags = lessonTags2.sort((a, b) => (a > b) ? 1 : -1);
    // console.log('...no lessons tag filter...'+filter.key+'...'+filter.value);
    // console.log('lessonTags2',lessonTags2);
    // console.log('propsLessonTags',propsLessonTags);
    // console.log('props.lessonTags',props.lessonTags);
  }
  if (filter.field === 'lessonDetail' && filter.key === 'tags' && filter.value === 'Descending') {
    propsLessonTags = lessonTags2.sort((a, b) => (a < b) ? 1 : -1);
    // console.log('...no lessons tag filter...'+filter.key+'...'+filter.value);
    // console.log('lessonTags2',lessonTags2);
    // console.log('propsLessonTags',propsLessonTags);
    // console.log('props.lessonTags',props.lessonTags);
  }
  if (filter.field !== 'lessonDetail' && filter.key !== 'tags') {
    propsLessonTags = lessonTags2;
    // console.log('...no lessons tag filter...'+filter.key+'...'+filter.value);
    // console.log('lessonTags2',lessonTags2);
    // console.log('propsLessonTags',propsLessonTags);
    // console.log('props.lessonTags',props.lessonTags);
  }

  const tags = propsLessonTags.map(tag => {
    return (
      <LessonTagItem
        public={props.public}
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
