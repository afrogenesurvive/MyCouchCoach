import React from 'react';
import moment from 'moment';

import LessonReminderItem from './LessonItem/LessonReminderItem';
import './UserList.css';

const lessonReminderList = props => {

  const {...filter} = props.filter;
  let lessonReminders2 = props.lessonReminders;
  let propsLessonReminders = [];
  let count = 0;

  if (filter.field === 'lessonDetail' && filter.key === 'reminders' && filter.value === 'sendDateAscending') {
    propsLessonReminders = lessonReminders2.sort((a, b) => (a.sendDate > b.sendDate ? 1 : -1));
  }
  if (filter.field === 'lessonDetail' && filter.key === 'reminders' && filter.value === 'sendDateDescending') {
    propsLessonReminders = lessonReminders2.sort((a, b) => (a.sendDate < b.sendDate ? 1 : -1));
  }
  if (filter.field === 'lessonDetail' && filter.key === 'reminders' && filter.value === 'sendDateTimeAscending') {
    propsLessonReminders = lessonReminders2.sort((a, b) => (moment(new Date(a.sendDate.substr(0,10)*1000)) > moment(new Date(b.sendDate.substr(0,10)*1000)) ? 1 : -1));
  }
  if (filter.field === 'lessonDetail' && filter.key === 'reminders' && filter.value === 'sendDateTimeDescending') {
    propsLessonReminders = lessonReminders2.sort((a, b) => (moment(new Date(a.sendDate.substr(0,10)*1000)) < moment(new Date(b.sendDate.substr(0,10)*1000)) ? 1 : -1));
  }
  if (filter.field === 'lessonDetail' && filter.key === 'reminders' && filter.value === 'titleAscending') {
    propsLessonReminders = lessonReminders2.sort((a, b) => (a.title > b.title ? 1 : -1));
  }
  if (filter.field === 'lessonDetail' && filter.key === 'reminders' && filter.value === 'titleDescending') {
    propsLessonReminders = lessonReminders2.sort((a, b) => (a.title < b.title ? 1 : -1));
  }
  if (filter.field === 'lessonDetail' && filter.key === 'reminders' && filter.value === 'creatorUsernameAscending') {
    propsLessonReminders = lessonReminders2.sort((a, b) => (a.title > b.title ? 1 : -1));
  }
  if (filter.field === 'lessonDetail' && filter.key === 'reminders' && filter.value === 'creatorUsernameDescending') {
    propsLessonReminders = lessonReminders2.sort((a, b) => (a.title < b.title ? 1 : -1));
  }
  if (filter.field === 'lessonDetail' && filter.key === 'reminders' && filter.value === 'lessonTitleAscending') {
    propsLessonReminders = lessonReminders2.sort((a, b) => (a.lesson.title > b.lesson.title ? 1 : -1));
  }
  if (filter.field === 'lessonDetail' && filter.key === 'reminders' && filter.value === 'lessonTitleDescending') {
    propsLessonReminders = lessonReminders2.sort((a, b) => (a.lesson.title < b.lesson.title ? 1 : -1));
  }
  if (filter.field === 'lessonDetail' && filter.key === 'reminders' && filter.value === 'sessionTitleAscending') {
    propsLessonReminders = lessonReminders2.sort((a, b) => (a.session.title > b.session.title ? 1 : -1));
  }
  if (filter.field === 'lessonDetail' && filter.key === 'reminders' && filter.value === 'sessionTitleDescending') {
    propsLessonReminders = lessonReminders2.sort((a, b) => (a.session.title < b.session.title ? 1 : -1));
  }
  if (filter.field === 'lessonDetail' && filter.key === 'reminders' && filter.value === 'deliveryEmail') {
    propsLessonReminders = lessonReminders2.filter(x => x.delivery.type === 'Email')
  }
  if (filter.field === 'lessonDetail' && filter.key === 'reminders' && filter.value === 'deliverySMS') {
    propsLessonReminders = lessonReminders2.filter(x => x.delivery.type === 'SMS')
  }
  if (filter.field === 'lessonDetail' && filter.key === 'reminders' && filter.value === 'deliveryCouchCoachMSG') {
    propsLessonReminders = lessonReminders2.filter(x => x.delivery.type === 'CouchCoachMSG')
  }
  if (filter.field === 'lessonDetail' && filter.key === 'reminders' && filter.value === 'deliveryAll') {
    propsLessonReminders = lessonReminders2.filter(x => x.delivery.type === 'All')
  }
  if (filter.field !== 'lessonDetail' && filter.key !== 'reminders') {
    propsLessonReminders = lessonReminders2;
  }

  const reminders = propsLessonReminders.map(reminder => {
    // console.log('reminder',reminder);
    // let x = moment(new Date(reminder.sendDate.substr(0,10)*1000))
    // console.log('moment createDate',x);
    count = propsLessonReminders.indexOf(reminder)+1;
    const reminderCreateDate = new Date (reminder.createDate.substr(0,10)*1000).toLocaleDateString().slice(0,10);
    const reminderSendDate = new Date (reminder.sendDate.substr(0,10)*1000).toLocaleDateString().slice(0,10);
    const reminderSessionDate = new Date (reminder.session.date.substr(0,10)*1000).toLocaleDateString().slice(0,10);
    const reminderSessionEndDate = new Date (reminder.session.endDate.substr(0,10)*1000).toLocaleDateString().slice(0,10);
    return (
      <LessonReminderItem
        key={count}
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
