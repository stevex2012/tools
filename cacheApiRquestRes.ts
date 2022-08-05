// 接口数据缓存
export interface ICacheApiRquestRes {
  path: string;
  apiFn: (arg?: any) => Promise<any>;
  cacheable?: boolean;
}
export function cacheApiRquestRes<T, K>(apiFn: (arg?: any) => Promise<any>) {
  return function beforeRequest({
    path,
    cacheable = true,
  }: Pick<ICacheApiRquestRes, 'cacheable' | 'path'>) {
    const cacheMap: Record<string, any> = {};
    return function doRequest(p?: T) {
      if (!cacheable) {
        return apiFn(p);
      }
      return new Promise<K>((res, rej) => {
        // key
        const key = window.encodeURI(JSON.stringify({ path, params: p }));
        if (cacheMap[key] && cacheMap.data) {
          return res(cacheMap.data);
        } else {
          return apiFn(p)
            .then((resData: K) => {
              cacheMap[key] = key;
              cacheMap.data = resData;
              res(resData);
            })
            .catch(rej);
        }
      });
    };
  };
}
// useage cacheApiRquestRes<string, any>(fn)({path:'xxxx'})