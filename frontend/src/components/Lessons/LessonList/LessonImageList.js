import React from 'react';

import LessonImageItem from './LessonItem/LessonImageItem';
import './UserList.css';

const lessonImageList = props => {

  const images = props.lessonImages.map(image => {
    return (
      <LessonImageItem
        key={image}
        image={image}
        name={image.name}
        type={image.type}
        path={image.path}
        authId={props.authId}
        canDelete={props.canDelete}
        onDelete={props.onDelete}
      />
    );
  });

  return <ul className="user__list1_master">{images}</ul>;
};

export default lessonImageList;
