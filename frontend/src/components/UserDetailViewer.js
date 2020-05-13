import React from 'react';
// import Button from 'react-bootstrap/Button';
import UserDetail from './Users/UserDetail';

import "./AttachmentViewer.css"

const UserDetailViewer = (props) =>{

return (
  <div className="attachmentViewerBg">
    <div className="attachmentViewer">

    <UserDetail
      authId={props.authId}
      user={props.user}
      canReport={props.canReport}
      onReport={props.onReport}
      canDelete={props.canDelete}
      onDelete={props.onDelete}
      onFriendRequest={props.onFriendRequest}
      onStartSendMessage={props.onStartSendMessage}
      onHideUserDetail={props.onHideUserDetail}
      creatingMessage={props.creatingMessage}
      messageReceiver={props.messageReceiver}
      cancelMessage={props.cancelMessage}
      sendMessage={props.sendMessage}
      myFriends={props.myFriends}
      profile={props.profile}
      onStartSendMessage={props.onStartSendMessage}
      sendingProfileMessage={props.sendingProfileMessage}
      cancelProfileMessage={props.cancelProfileMessage}
      sendProfileMessage={props.sendProfileMessage}
    />

    </div>
  </div>
)

}


export default UserDetailViewer;
