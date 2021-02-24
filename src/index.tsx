import {async, bootstrap} from "./core-fe";
import {ErrorHandler} from "./ErrorHandler";
import "antd/dist/antd.css";
const Entry = async(() => import(/* webpackChunkName: "entry" */ "./pages/entry"), "Entry");

// 挂载根节点
function creatRootDOM() {
    return document.getElementById("app");
}
bootstrap({
    componentType: Entry,
    errorListener: new ErrorHandler(),
    loggerConfig: {
        serverURL: "http://localhost:8080/api/event/logs",
        slowStartupThreshold: 1,
        maskedKeywords: [/\d+/g], // 脱敏
    },
    browserConfig: {
        navigationPreventionMessage: "确定离开当前页面？", // 不生效
    },
    rootContainer: creatRootDOM(),
});
