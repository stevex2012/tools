// 错误处理包裹函数
export function errorWrapFn(fn:(arg?:any)=>any){
    return function doErrorWrapFn(...rest){
        try {
            fn.apply(null,Array.from(rest))
        } catch (error) {
            console.log(error)
        }   
    }
}

// 调用埋点函数
export interface IChecheSDKInit {
    apiName:string;//api 名称
    fn:(arg)=>any;
    chechIntervalTime?: number;//检测时间
    maxCheckNum?: number// 最大检测次数
}

export function checheSDKInit({apiName, fn, chechIntervalTime = 500,maxCheckNum = 9999}:IChecheSDKInit){
    // 已经初始化
    // 没有初始化
    let timer = null;
    // 需要一个队列，在调用的sdk没有初始化，吧未成功的push进去
    return function check(...rest){
        if(window?.[apiName]){
            return errorWrapFn(fn)(rest)
        }else{
            timer = setInterval(()=>{
                if(maxCheckNum<=0){
                    clearInterval(timer)
                }
                if(window?.[apiName]){
                    clearInterval(timer)
                    return errorWrapFn(fn)(rest)
                }
                maxCheckNum -= 1;
            },chechIntervalTime)
        }
    }
}

