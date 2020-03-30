import React from 'react';

import UserAttachmentItem from './UserItem/UserAttachmentItem';
import './UserList.css';

const userAttachmentList = props => {
  const userAttachment = props.userAttachment.map(attachment => {
    const attachmentLink = "https://ent-emr-bucket.s3-us-east-2.amazonaws.com/"+attachment.path+"/"+attachment.name+"."+attachment.format;

    return (
      <UserAttachmentItem
        key={attachment.name}
        userId={props.authUserId}
        name={attachment.name}
        format={attachment.format}
        path={attachment.path}
        canDelete={props.canDelete}
        onDelete={props.onDelete}
        attachment={attachment}
        onViewAttachment={props.onViewAttachment}
        attachmentLink={attachmentLink}
      />
    );
  });

  return <ul className="user__list1_detail">{userAttachment}</ul>;
};

export default userAttachmentList;
