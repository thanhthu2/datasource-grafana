export async function transformRequest<T = any>(promise: T) {
    return Promise.all([promise]).then(([response]: any) => {
      const isError = [400, 401, 403, 404, 405, 500, 503, 504, 429].includes(response.status_code);
      if (isError) {
        return [response, null];
      } else {
        return [null, response || response];
      }
    });
  }