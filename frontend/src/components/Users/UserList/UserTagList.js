import React from 'react';

import UserTagItem from './UserItem/UserTagItem';
import './UserList.css';

const userTagList = props => {

  const {...filter} = props.filter;
  let userTags2 = props.userTags;
  let propsUserTags = [];

  if (filter.field === 'tags' && filter.key === 'tag' && filter.value === 'Ascending') {
    propsUserTags = userTags2.sort((a, b) => (a < b) ? 1 : -1);
    // console.log('...no tag filter...'+filter.key+'...'+filter.value);
    // console.log('userTags2',userTags2);
    // console.log('propsUserTags',propsUserTags);
    // console.log('propsUserTags',propsUserTags);
  }
  if (filter.field === 'tags' && filter.key === 'tag' && filter.value === 'Descending') {
    propsUserTags = userTags2.sort((a, b) => (a > b) ? 1 : -1);
    // console.log('...no tag filter...'+filter.key+'...'+filter.value);
    // console.log('userTags2',userTags2);
    // console.log('propsUserTags',propsUserTags);
    // console.log('propsUserTags',propsUserTags);
  }
  if (filter.field !== 'tags') {
    propsUserTags = userTags2;
    // console.log('...no tag filter...'+filter.key+'...'+filter.value);
    // console.log('userTags2',userTags2);
    // console.log('propsUserTags',propsUserTags);
    // console.log('propsUserTags',propsUserTags);
  }

  const userTags = propsUserTags.map(tag => {

    return (
      <UserTagItem
        key={tag}
        authId={props.authId}
        tag={tag}
        onDelete={props.onDelete}
        canDelete={props.canDelete}
      />
    );
  });

  return <ul className="user__list1_detail">{userTags}</ul>;
};

export default userTagList;
