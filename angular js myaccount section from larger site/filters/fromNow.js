'use strict';

/* Filters */
// need load the moment.js to use this filter. 
angular.module('app')
  .filter('fromNow', function() {
    return function(date) {
      return moment(date).fromNow();
    }
  }).filter('dateToISO', function() {
  return function(input) {
    return new Date(input).toISOString();
  };
});