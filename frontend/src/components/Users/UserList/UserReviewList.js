import React from 'react';

import UserReviewItem from './UserItem/UserReviewItem';
import './UserList.css';

const userReviewList = props => {

  const {...filter} = props.filter;
  let userReviews2 = props.userReviews;
  let propsUserReviews = [];

  if (filter.field === 'userReviews' && filter.key === 'type') {
    propsUserReviews = userReviews2.filter(x => x.type === filter.value);
    // console.log('...filtering user reviews by...'+filter.key+'...'+filter.value);
    // console.log('userReviews2',userReviews2);
    // console.log('propsUserReviews',propsUserReviews);
    // console.log('props.userReviews',props.userReviews);
  }
  if (filter.field === 'userReviews' && filter.key === 'date' && filter.value === 'Ascending') {
    propsUserReviews = userReviews2.sort((a, b) => (a.date > b.date) ? 1 : -1);
    // console.log('...filtering user reviews by...'+filter.key+'...'+filter.value);
    // console.log('userReviews2',userReviews2);
    // console.log('propsUserReviews',propsUserReviews);
    // console.log('props.userReviews',props.userReviews);
  }
  if (filter.field === 'userReviews' && filter.key === 'date' && filter.value === 'Descending') {
    propsUserReviews = userReviews2.sort((a, b) => (a.date < b.date) ? 1 : -1);
    // console.log('...filtering user reviews by...'+filter.key+'...'+filter.value);
    // console.log('userReviews2',userReviews2);
    // console.log('propsUserReviews',propsUserReviews);
    // console.log('props.userReviews',props.userReviews);
  }
  if (filter.field === 'userReviews' && filter.key === 'rating' && filter.value === 'Ascending') {
    propsUserReviews = userReviews2.sort((a, b) => (a.rating > b.rating) ? 1 : -1);
    // console.log('...filtering user reviews by...'+filter.key+'...'+filter.value);
    // console.log('userReviews2',userReviews2);
    // console.log('propsUserReviews',propsUserReviews);
    // console.log('props.userReviews',props.userReviews);
  }
  if (filter.field === 'userReviews' && filter.key === 'rating' && filter.value === 'Descending') {
    propsUserReviews = userReviews2.sort((a, b) => (a.rating < b.rating) ? 1 : -1);
    // console.log('...filtering user reviews by...'+filter.key+'...'+filter.value);
    // console.log('userReviews2',userReviews2);
    // console.log('propsUserReviews',propsUserReviews);
    // console.log('props.userReviews',props.userReviews);
  }
  if (filter.field === 'userReviews' && filter.key === 'lessonTitle' && filter.value === 'Ascending') {
    propsUserReviews = userReviews2.sort((a, b) => (a.lesson.title > b.lesson.title) ? 1 : -1);
    // console.log('...filtering user reviews by...'+filter.key+'...'+filter.value);
    // console.log('userReviews2',userReviews2);
    // console.log('propsUserReviews',propsUserReviews);
    // console.log('props.userReviews',props.userReviews);
  }
  if (filter.field === 'userReviews' && filter.key === 'lessonTitle' && filter.value === 'Descending') {
    propsUserReviews = userReviews2.sort((a, b) => (a.lesson.title < b.lesson.title) ? 1 : -1);
    // console.log('...filtering user reviews by...'+filter.key+'...'+filter.value);
    // console.log('userReviews2',userReviews2);
    // console.log('propsUserReviews',propsUserReviews);
    // console.log('props.userReviews',props.userReviews);
  }
  if (filter.field !== 'userReviews') {
    propsUserReviews = userReviews2;
    // console.log('...no userReview filter...'+filter.key+'...'+filter.value);
    // console.log('userReviews2',userReviews2);
    // console.log('propsUserReviews',propsUserReviews);
    // console.log('props.userReviews',props.userReviews);
  }

  const userReviews = propsUserReviews.map(review => {
    const reviewDate = new Date (review.date.substr(0,10)*1000).toLocaleDateString().slice(0,10);
    return (
      <UserReviewItem
        key={review._id}
        authId={props.authId}
        _id={review._id}
        date={reviewDate}
        type={review.type}
        body={review.body}
        rating={review.rating}
        review={review}
        lesson={review.lesson}
      />
    );
  });

  return <ul className="user__list1_master">{userReviews}</ul>;
};

export default userReviewList;
