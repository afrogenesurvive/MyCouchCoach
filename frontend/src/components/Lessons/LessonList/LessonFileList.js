import React from 'react';

import LessonFileItem from './LessonItem/LessonFileItem';
import './UserList.css';

const lessonFileList = props => {

  const files = props.lessonFiles.map(file => {
    return (
      <LessonFileItem
        key={file}
        file={file}
        name={file.name}
        type={file.type}
        size={file.size}
        path={file.path}
        authId={props.authId}
      />
    );
  });

  return <ul className="user__list1_master">{files}</ul>;
};

export default lessonFileList;
