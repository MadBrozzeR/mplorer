export function AsyncMemo<T> (promise: Promise<T>) {
  let result: T | null = null;
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

export function wait (delay: number) {
  return new Promise<void>(function (resolve) {
    if (delay) {
      setTimeout(resolve, delay);
    } else {
      resolve();
    }
  });
}
