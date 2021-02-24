import { createActionHandlerDecorator } from "core-fe";

export function doSomeCanNotSeePeople() {
  return createActionHandlerDecorator(function* (handler) {
        try {
            console.log('触发之前做点什么')
            yield* handler();
            console.log('触发之后做点什么')
        } catch (e) {
            console.log('报错',e)
        }
  });
}