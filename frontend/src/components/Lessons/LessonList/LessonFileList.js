import React from 'react';

import LessonFileItem from './LessonItem/LessonFileItem';
import './UserList.css';

const lessonFileList = props => {

  const {...filter} = props.filter;
  let lessonFiles2 = props.lessonFiles;
  let propsLessonFiles = [];

  if (filter.field === 'lessonDetail' && filter.key === 'files' && filter.value === 'nameAscending') {
    propsLessonFiles = lessonFiles2.sort((a, b) => (a.name > b.name) ? 1 : -1);
  }
  if (filter.field === 'lessonDetail' && filter.key === 'files' && filter.value === 'nameDescending') {
    propsLessonFiles = lessonFiles2.sort((a, b) => (a.name < b.name) ? 1 : -1);
  }
  if (filter.field === 'lessonDetail' && filter.key === 'files' && filter.value === 'publicTrue') {
    propsLessonFiles = lessonFiles2.filter(x => x.public === true);
  }
  if (filter.field === 'lessonDetail' && filter.key === 'files' && filter.value === 'publicFalse') {
    propsLessonFiles = lessonFiles2.filter(x => x.public === false);
  }
  if (filter.field !== 'lessonDetail' && filter.key !== 'files') {
    propsLessonFiles = lessonFiles2;
  }

  const files = propsLessonFiles.map(file => {
    console.log('file',file);
    return (
      <LessonFileItem
        key={file}
        file={file}
        name={file.name}
        type={file.type}
        size={file.size}
        path={file.path}
        public={file.public}
        authId={props.authId}
        canDelete={props.canDelete}
        onDelete={props.onDelete}
        toggleLessonFilePublic={props.toggleLessonFilePublic}
      />
    );
  });

  return <ul className="user__list1_master">{files}</ul>;
};

export default lessonFileList;
