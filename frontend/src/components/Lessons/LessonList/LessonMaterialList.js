import React from 'react';

import LessonMaterialItem from './LessonItem/LessonMaterialItem';
import './UserList.css';

const lessonMaterialList = props => {

  const {...filter} = props.filter;
  let lessonMaterials2 = props.lessonMaterials;
  let propsLessonMaterials = [];

  if (filter.field === 'lessonDetail' && filter.key === 'materials' && filter.value === 'Ascending') {
    propsLessonMaterials = lessonMaterials2.sort((a, b) => (a > b) ? 1 : -1);
    // console.log('...no lessons schedule filter...'+filter.key+'...'+filter.value);
    // console.log('lessonMaterials2',lessonMaterials2);
    // console.log('propsLessonMaterials',propsLessonMaterials);
    // console.log('props.lessonMaterials',props.lessonMaterials);
  }
  if (filter.field === 'lessonDetail' && filter.key === 'materials' && filter.value === 'Descending') {
    propsLessonMaterials = lessonMaterials2.sort((a, b) => (a < b) ? 1 : -1);
    // console.log('...no lessons schedule filter...'+filter.key+'...'+filter.value);
    // console.log('lessonMaterials2',lessonMaterials2);
    // console.log('propsLessonMaterials',propsLessonMaterials);
    // console.log('props.lessonMaterials',props.lessonMaterials);
  }
  if (filter.field !== 'lessonDetail' && filter.key !== 'materials') {
    propsLessonMaterials = lessonMaterials2;
    // console.log('...no lessons schedule filter...'+filter.key+'...'+filter.value);
    // console.log('lessonMaterials2',lessonMaterials2);
    // console.log('propsLessonMaterials',propsLessonMaterials);
    // console.log('props.lessonMaterials',props.lessonMaterials);
  }

  const materials = propsLessonMaterials.map(material => {
    return (
      <LessonMaterialItem
        key={material}
        material={material}
        authId={props.authId}
        canDelete={props.canDelete}
        onDelete={props.onDelete}
      />
    );
  });

  return <ul className="user__list1_master">{materials}</ul>;
};

export default lessonMaterialList;
