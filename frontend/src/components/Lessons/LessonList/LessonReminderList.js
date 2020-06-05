import React from 'react';

import LessonReminderItem from './LessonItem/LessonReminderItem';
import './UserList.css';

const lessonReminderList = props => {

  const reminders = props.lessonReminders.map(reminder => {
    console.log('reminder',reminder);
    const reminderCreateDate = new Date (reminder.createDate.substr(0,10)*1000).toLocaleDateString().slice(0,10);
    const reminderSendDate = new Date (reminder.sendDate.substr(0,10)*1000).toLocaleDateString().slice(0,10);
    const reminderSessionDate = new Date (reminder.session.date.substr(0,10)*1000).toLocaleDateString().slice(0,10);
    const reminderSessionEndDate = new Date (reminder.session.endDate.substr(0,10)*1000).toLocaleDateString().slice(0,10);
    return (
      <LessonReminderItem
        key={reminder._id}
        authId={props.authId}
        _id={reminder._id}
        createDate={reminderCreateDate}
        sendDate={reminderSendDate}
        creator={reminder.creator}
        title={reminder.title}
        type={reminder.type}
        time={reminder.time}
        trigger={reminder.trigger}
        session={reminder.session}
        sessionDate={reminderSessionDate}
        sessionEndDate={reminderSessionEndDate}
        body={reminder.body}
        recipients={reminder.recipients}
        delivery={reminder.delivery}
        reminder={reminder}
        isInstructor={props.isInstructor}
        deleteLessonReminder={props.deleteLessonReminder}
      />
    );
  });

  return <ul className="user__list1_master">{reminders}</ul>;
};

export default lessonReminderList;
