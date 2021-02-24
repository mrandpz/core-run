import {Module, register,Lifecycle} from "core-fe";
import MainComponent from "./components/Entry";
import {RootState} from "type/state";
import { SagaGenerator,call } from 'core-fe/typed-saga';
import { helloWrold } from "service/TestApi";
class EntryModule extends Module<RootState, "entry"> {
  *getHello():SagaGenerator{
    const response = yield* call(helloWrold)
  }

  // 入口文件没有路由，禁止使用onLocationMatched
  @Lifecycle()
  *onEnter(): SagaGenerator {
    console.log('enter')
      yield* this.getHello();
  }

}

const module = register(new EntryModule("entry", {}));
export const Entry = module.attachLifecycle(MainComponent);