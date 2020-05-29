import React from 'react';

import UserProfileImageItem from './UserItem/UserProfileImageItem';
import './UserList.css';

const userProfileImageList = props => {
  const {...filter} = props.filter;
  let userProfileImages2 = props.userProfileImages;
  let propsUserProfileImages = [];

  if (filter.field === 'profileImages' && filter.key === 'public') {
    propsUserProfileImages = userProfileImages2.filter(x => x.public === filter.value);
    console.log('...filter profile images by...'+filter.key+'...'+filter.value);
    console.log('let userProfileImages2',userProfileImages2);
    console.log('propsUserProfileImages',propsUserProfileImages);
    console.log('props.userProfileImages',props.userProfileImages);
  }
  if (filter.field === 'profileImages' && filter.key === 'type' && filter.value === 'Ascending') {
    propsUserProfileImages = userProfileImages2.sort((a, b) => (a.type > b.type) ? 1 : -1);
    console.log('...filter profile images by...'+filter.key+'...'+filter.value);
    console.log('let userProfileImages2',userProfileImages2);
    console.log('propsUserProfileImages',propsUserProfileImages);
    console.log('props.userProfileImages',props.userProfileImages);
  }
  if (filter.field === 'profileImages' && filter.key === 'type' && filter.value === 'Descending') {
    propsUserProfileImages = userProfileImages2.sort((a, b) => (a.type < b.type) ? 1 : -1);
    console.log('...filter profile images by...'+filter.key+'...'+filter.value);
    console.log('let userProfileImages2',userProfileImages2);
    console.log('propsUserProfileImages',propsUserProfileImages);
    console.log('props.userProfileImages',props.userProfileImages);
  }

  if (filter.field !== 'profileImages') {
    propsUserProfileImages = userProfileImages2;
    console.log('...no profile image filter...'+filter.key+'...'+filter.value);
    console.log('let userProfileImages2',userProfileImages2);
    console.log('propsUserProfileImages',propsUserProfileImages);
    console.log('props.userProfileImages',props.userProfileImages);
  }

  const userProfileImages = propsUserProfileImages.map(profileImage => {

    return (
      <UserProfileImageItem
        key={profileImage.path}
        authId={props.authId}
        name={profileImage.name}
        type={profileImage.type}
        path={profileImage.path}
        public={profileImage.public}
        profileImage={profileImage}
        onDelete={props.onDelete}
        canDelete={props.canDelete}
        toggleUserProfileImagePublic={props.toggleUserProfileImagePublic}
      />
    );
  });

  return <ul className="user__list1_detail">{userProfileImages}</ul>;
};

export default userProfileImageList;
