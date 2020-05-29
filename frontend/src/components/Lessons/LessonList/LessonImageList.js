import React from 'react';

import LessonImageItem from './LessonItem/LessonImageItem';
import './UserList.css';

const lessonImageList = props => {

  let lessonImages2 = props.lessonImages;
  let propsLessonImages = [];
  if (props.public) {
    propsLessonImages = lessonImages2.filter(x => x.public === true);
  } else {
    propsLessonImages = lessonImages2;
  }

  const images = propsLessonImages.map(image => {
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
