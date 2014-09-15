var VError, httpRequest, async, uri;
VError = require('verror');
httpRequest = require('request');
async = require('async');

exports.configUri = function (newUri) {
  'use strict';

  uri = newUri;
};

function downloadPages(url, next) {
  'use strict';

  var lastPage, results, lastLength;
  results = [];
  lastLength = 0;
  lastPage = 0;
  async.doWhilst(function (next) {
    return httpRequest({
      'url'  : uri + url,
      'json' : true,
      'qs'   : {'page' : lastPage}
    }, function (error, res, body) {
      if (error) {
        return next(error);
      }
      results = results.concat(body);
      lastLength = body.length;
      lastPage++;
      return next();
    });
  }, function () {
    return lastLength > 0;
  }, function (error) {
    return next(error, results);
  });
}

exports.enrollments = function (user, next) {
  'use strict';

  return downloadPages('/users/' + user + '/enrollments', next);
};

exports.enrollment = function (user, id, next) {
  'use strict';

  return httpRequest({
    'url'  : uri + '/users/' + user + '/enrollments/' + id,
    'json' : true
  }, function (error, res, body) {
    next(error, body);
  });
};

exports.requirements = function (user, enrollment, next) {
  'use strict';

  return downloadPages('/users/' + user + '/enrollments/' + enrollment + '/requirements', next);
};

exports.requirement = function (user, enrollment, id, next) {
  'use strict';

  return httpRequest({
    'url'  : uri + '/users/' + user + '/enrollments/' + enrollment + '/requirements/' + id,
    'json' : true
  }, function (error, res, body) {
    next(error, body);
  });
};