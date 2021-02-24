import {State} from "core-fe";
import { UserState } from "pages/auth";

export interface RootState extends State {
    app: {
        entry: {};
        user:UserState,
        product: {}
    };
}
