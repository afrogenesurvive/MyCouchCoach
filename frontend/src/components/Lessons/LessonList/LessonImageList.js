import React from 'react';

import LessonImageItem from './LessonItem/LessonImageItem';
import './UserList.css';

const lessonImageList = props => {

  const {...filter} = props.filter;
  let lessonImages2 = props.lessonImages;
  let propsLessonImages = [];
  let propsLessonImages2 = [];

  if (props.public) {
    propsLessonImages = lessonImages2.filter(x => x.public === true);
  } else {
    propsLessonImages = lessonImages2;
  }

  propsLessonImages2 = propsLessonImages;
  if (filter.field === 'lessonDetail' && filter.key === 'images' && filter.value === 'nameAscending') {
    propsLessonImages2 = propsLessonImages.sort((a, b) => (a.name > b.name) ? 1 : -1);
  }
  if (filter.field === 'lessonDetail' && filter.key === 'images' && filter.value === 'nameDescending') {
    propsLessonImages2 = propsLessonImages.sort((a, b) => (a.name < b.name) ? 1 : -1);
  }
  if (filter.field === 'lessonDetail' && filter.key === 'images' && filter.value === 'publicTrue') {
    propsLessonImages2 = propsLessonImages.filter(x => x.public === true);
  }
  if (filter.field === 'lessonDetail' && filter.key === 'images' && filter.value === 'publicFalse') {
    propsLessonImages2 = propsLessonImages.filter(x => x.public === false);
  }
  if (filter.field !== 'lessonDetail' && filter.key !== 'images') {
    propsLessonImages2 = propsLessonImages;
  }

  const images = propsLessonImages2.map(image => {
    return (
      <LessonImageItem
        public={props.public}
        key={image}
        image={image}
        name={image.name}
        type={image.type}
        path={image.path}
        public={image.public}
        authId={props.authId}
        canDelete={props.canDelete}
        onDelete={props.onDelete}
        toggleLessonImagePublic={props.toggleLessonImagePublic}
      />
    );
  });

  return <ul className="user__list1_master">{images}</ul>;
};

export default lessonImageList;
