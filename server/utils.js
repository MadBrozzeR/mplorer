module.exports.AsyncMemo = function AsyncMemo (promise) {
  let result = null;
  let ready = false;

  const newPromise = promise.catch(function (error) {
    return error;
  }).then(function (promiseResult) {
    result = promiseResult;
    ready = true;

    return result;
  });

  return function () {
    if (ready) {
      return Promise.resolve(result);
    } else {
      return newPromise;
    }
  };
};
