import React from 'react';

import LessonMaterialItem from './LessonItem/LessonMaterialItem';
import './UserList.css';

const lessonMaterialList = props => {

  const materials = props.lessonMaterials.map(material => {
    return (
      <LessonMaterialItem
        key={material}
        material={material}
        authId={props.authId}
      />
    );
  });

  return <ul className="user__list1_master">{materials}</ul>;
};

export default lessonMaterialList;
