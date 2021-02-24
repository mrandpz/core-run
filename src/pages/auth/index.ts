import {call, Lifecycle, Module, register, SagaGenerator,Interval,Loading} from "core-fe";
import {RootState} from "type/state";
import { login as loginApi, logout as logoutApi,getCurrentUser} from 'service/AuthApi';
import LoginFormComponent from './component/LoginForm'
import { LOADING_LOGIN } from "./type";
export interface UserState {
  currentUser: {
      loggedIn: boolean;
      username: string | null;
      gendle?: '男' | '女' | '未知'
  };
}


const initialState: UserState = {
    currentUser: {
        loggedIn: false,
        username: null,
    },
};

class UserModule extends Module<RootState, "user", {}, {}> {
    @Lifecycle()
    *onLocationMatched(): SagaGenerator {
        console.log("onLocationMatched");
    }

    @Lifecycle()
    @Interval(3)
    *onTick(): SagaGenerator {
        console.log("didadida:3s timeout");
    }

    *logout(): SagaGenerator {
        yield* call(logoutApi);
        this.setState({
            currentUser: {
                loggedIn: false,
                username: null,
            },
        });
    }

    @Loading(LOADING_LOGIN)
    *login(username: string, password: string): SagaGenerator {
        const response = yield* call(loginApi, {username, password});
        this.setState({
            currentUser: {
                loggedIn: response.loggedIn,
                username: response.username,
            },
        });
        if (response.loggedIn) {
            yield* this.pushHistory("/product");
        }
    }
}

const module = register(new UserModule("user", initialState));
export const actions = module.getActions();
// 如果需要使用到生命周期，需要主动 attach
export const LoginForm = module.attachLifecycle(LoginFormComponent);
