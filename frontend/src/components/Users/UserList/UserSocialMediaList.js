import React from 'react';

import UserSocialMediaItem from './UserItem/UserSocialMediaItem';
import './UserList.css';

const userSocialMediaList = props => {

  const {...filter} = props.filter;
  let userSocialMedia2 = props.userSocialMedia;
  let propsUserSocialMedia = [];

  if (filter.field === 'socialMedia' && filter.key === 'platform' && filter.value === 'Ascending') {
    propsUserSocialMedia = userSocialMedia2.sort((a, b) => (a.platform > b.platform) ? 1 : -1);
    // console.log('...filter social media...by...'+filter.key+'...'+filter.value);
    // console.log('userSocialMedia2',userSocialMedia2);
    // console.log('propsUserSocialMedia',propsUserSocialMedia);
    // console.log('props.userSocialMedia',props.userSocialMedia);
  }
  if (filter.field === 'socialMedia' && filter.key === 'platform' && filter.value === 'Descending') {
    propsUserSocialMedia = userSocialMedia2.sort((a, b) => (a.platform < b.platform) ? 1 : -1);
    // console.log('...filter social media...by...'+filter.key+'...'+filter.value);
    // console.log('userSocialMedia2',userSocialMedia2);
    // console.log('propsUserSocialMedia',propsUserSocialMedia);
    // console.log('props.userSocialMedia',props.userSocialMedia);
  }

  if (filter.field !== 'socialMedia') {
    propsUserSocialMedia = userSocialMedia2;
    // console.log('...no profile Image filter...'+filter.key+'...'+filter.value);
    // console.log('userSocialMedia2',userSocialMedia2);
    // console.log('propsUserSocialMedia',propsUserSocialMedia);
    // console.log('props.userSocialMedia',props.userSocialMedia);
  }

  const userSocialMedia = propsUserSocialMedia.map(socialMediaAccount => {

    return (
      <UserSocialMediaItem
        key={socialMediaAccount.handle}
        authId={props.authId}
        platform={socialMediaAccount.platform}
        handle={socialMediaAccount.handle}
        link={socialMediaAccount.link}
        socialMediaAccount={socialMediaAccount}
        onDelete={props.onDelete}
        canDelete={props.canDelete}
      />
    );
  });

  return <ul className="user__list1_detail">{userSocialMedia}</ul>;
};

export default userSocialMediaList;
