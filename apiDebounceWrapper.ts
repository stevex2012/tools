// //接口内容缓存器,避免一个接口相同参数同时发起请求
// 缓存一次相同接口，不同第二次相同请求直接返回

export function apiDebounceWrapper<T,K>(apiFn: (arg?: any) => Promise<K>) {
    // cachemap
  let cacheMap: Record<
    string,
    {
      loading: boolean;
      data: any;
    }
  > = {};
  return function doRequest(...rest: [T]) {
    return new Promise((res, rej) => {
      const key = JSON.stringify(rest);
      if (cacheMap[key]) {
        if (cacheMap[key]?.loading) {
          return;
        } else {
          return rej(cacheMap[key]?.data);
        }
      } else {
        // 没有这个key
        //  先清空
        cacheMap = {};
        cacheMap[key] = {
          loading: true,
          data: [],
        };
      }
      // eslint-disable-next-line prefer-spread
      apiFn
        .apply(null, rest)
        .then((response:K) => {
          res(response);
          cacheMap[key].data = response;
        })
        .catch(rej)
        .finally(() => {
          cacheMap[key].loading = false;
        });
    });
  };
}
