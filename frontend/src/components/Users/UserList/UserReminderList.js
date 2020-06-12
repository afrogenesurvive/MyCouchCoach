import React from 'react';
import moment from 'moment';

import UserReminderItem from './UserItem/UserReminderItem';
import './UserList.css';

const userReminderList = props => {

  const {...filter} = props.filter;
  let userReminders2 = props.userReminders;
  let propsUserReminders = [];

  let count = 0;

  if (filter.field === 'reminders' && filter.key === 'sendDate' && filter.value === 'Ascending') {
    propsUserReminders = userReminders2.sort((a, b) => (a.sendDate > b.sendDate ? 1 : -1));
  }
  if (filter.field === 'reminders' && filter.key === 'sendDate' && filter.value === 'Descending') {
    propsUserReminders = userReminders2.sort((a, b) => (a.sendDate < b.sendDate ? 1 : -1));
  }
  if (filter.field === 'reminders' && filter.key === 'sendDateTime' && filter.value === 'Ascending') {
    propsUserReminders = userReminders2.sort((a, b) => (moment(new Date(a.sendDate.substr(0,10)*1000)) > moment(new Date(b.sendDate.substr(0,10)*1000)) ? 1 : -1));
  }
  if (filter.field === 'reminders' && filter.key === 'sendDateTime' && filter.value === 'Descending') {
    propsUserReminders = userReminders2.sort((a, b) => (moment(new Date(a.sendDate.substr(0,10)*1000)) < moment(new Date(b.sendDate.substr(0,10)*1000)) ? 1 : -1));
  }
  if (filter.field === 'reminders' && filter.key === 'title' && filter.value === 'Ascending') {
    propsUserReminders = userReminders2.sort((a, b) => (a.title > b.title ? 1 : -1));
  }
  if (filter.field === 'reminders' && filter.key === 'title' && filter.value === 'Descending') {
    propsUserReminders = userReminders2.sort((a, b) => (a.title < b.title ? 1 : -1));
  }
  if (filter.field === 'reminders' && filter.key === 'creatorUsername' && filter.value === 'Ascending') {
    propsUserReminders = userReminders2.sort((a, b) => (a.title > b.title ? 1 : -1));
  }
  if (filter.field === 'reminders' && filter.key === 'creatorUsername' && filter.value === 'Descending') {
    propsUserReminders = userReminders2.sort((a, b) => (a.title < b.title ? 1 : -1));
  }
  if (filter.field === 'reminders' && filter.key === 'userTitle' && filter.value === 'Ascending') {
    propsUserReminders = userReminders2.sort((a, b) => (a.user.title > b.user.title ? 1 : -1));
  }
  if (filter.field === 'reminders' && filter.key === 'userTitle' && filter.value === 'Descending') {
    propsUserReminders = userReminders2.sort((a, b) => (a.user.title < b.user.title ? 1 : -1));
  }
  if (filter.field === 'reminders' && filter.key === 'sessionTitle' && filter.value === 'Ascending') {
    propsUserReminders = userReminders2.sort((a, b) => (a.session.title > b.session.title ? 1 : -1));
  }
  if (filter.field === 'reminders' && filter.key === 'sessionTitle' && filter.value === 'Descending') {
    propsUserReminders = userReminders2.sort((a, b) => (a.session.title < b.session.title ? 1 : -1));
  }
  if (filter.field === 'reminders' && filter.key === 'delivery' && filter.value === 'Email') {
    propsUserReminders = userReminders2.filter(x => x.delivery.type === 'Email')
  }
  if (filter.field === 'reminders' && filter.key === 'delivery' && filter.value === 'SMS') {
    propsUserReminders = userReminders2.filter(x => x.delivery.type === 'SMS')
  }
  if (filter.field === 'reminders' && filter.key === 'delivery' && filter.value === 'CouchCoachMSG') {
    propsUserReminders = userReminders2.filter(x => x.delivery.type === 'CouchCoachMSG')
  }
  if (filter.field === 'reminders' && filter.key === 'delivery' && filter.value === 'All') {
    propsUserReminders = userReminders2.filter(x => x.delivery.type === 'All')
  }
  if (filter.field !== 'reminders') {
    propsUserReminders = userReminders2;
  }

  const reminders = props.userReminders.map(reminder => {
    count = props.userReminders.indexOf(reminder)+1;
    // console.log('reminder',reminder);
    const reminderCreateDate = new Date (reminder.createDate.substr(0,10)*1000).toLocaleDateString();
    const reminderSendDate = new Date (reminder.sendDate.substr(0,10)*1000).toLocaleDateString();
    const reminderSessionDate = new Date (reminder.session.date.substr(0,10)*1000).toLocaleDateString();
    const reminderSessionEndDate = new Date (reminder.session.endDate.substr(0,10)*1000).toLocaleDateString();
    return (
      <UserReminderItem
        key={count}
        _id={reminder._id}
        reminder={reminder}
        createDate={reminderCreateDate}
        sendDate={reminderSendDate}
        sessionDate={reminderSessionDate}
        sessionEndDate={reminderSessionEndDate}
        authId={props.authId}
        title={reminder.title}
        time={reminder.time}
        type={reminder.type}
        creator={reminder.creator}
        user={reminder.user}
        session={reminder.session}
        lesson={reminder.lesson}
        delivery={reminder.delivery}
        trigger={reminder.trigger}
      />
    );
  });

  return <ul className="user__list1_master">{reminders}</ul>;
};

export default userReminderList;
