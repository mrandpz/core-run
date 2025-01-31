import React from "react";
import {RouteComponentProps} from "react-router";
import {Task} from "redux-saga";
import {delay, call as rawCall} from "redux-saga/effects";
import {app} from "../app";
import {ActionCreators, executeAction} from "../module";
import {navigationPreventionAction} from "../reducer";
import {Module, ModuleLifecycleListener} from "./Module";

let startupModuleName: string | null = null;

export class ModuleProxy<M extends Module<any, any>> {
    constructor(private module: M, private actions: ActionCreators<M>) {}

    getActions(): ActionCreators<M> {
        return this.actions;
    }

    attachLifecycle<P extends object>(ComponentType: React.ComponentType<P>): React.ComponentType<P> {
        const moduleName = this.module.name as string;
        const lifecycleListener = this.module as ModuleLifecycleListener;
        const actions = this.actions as any;

        return class extends React.PureComponent<P> {
            static displayName = `Module[${moduleName}]`;
            private lifecycleSagaTask: Task | null = null;
            private lastDidUpdateSagaTask: Task | null = null;
            private tickCount: number = 0;
            private mountedTime: number = Date.now();

            constructor(props: P) {
                super(props);
                if (!startupModuleName) {
                    startupModuleName = moduleName;
                }
            }

            componentDidMount() {
                this.lifecycleSagaTask = app.sagaMiddleware.run(this.lifecycleSaga.bind(this));
            }

            componentDidUpdate(prevProps: Readonly<P>) {
                const prevLocation = (prevProps as any).location;
                const props = this.props as RouteComponentProps & P;
                const currentLocation = props.location;
                const currentRouteParams = props.match ? props.match.params : null;

                // Only trigger onLocationMatched if current component is connected to <Route>
                if (currentLocation && currentRouteParams && prevLocation !== currentLocation && lifecycleListener.onLocationMatched.isLifecycle) {
                    try {
                        this.lastDidUpdateSagaTask?.cancel();
                    } catch (e) {
                        // In rare case, it may throw error, just ignore
                    }
                    this.lastDidUpdateSagaTask = app.sagaMiddleware.run(function* () {
                        const action = `${moduleName}/@@LOCATION_MATCHED`;
                        const startTime = Date.now();
                        yield rawCall(executeAction, action, lifecycleListener.onLocationMatched.bind(lifecycleListener), currentRouteParams, currentLocation);
                        app.logger.info({
                            action,
                            elapsedTime: Date.now() - startTime,
                            info: {
                                // URL params should not contain any sensitive or complicated objects
                                route_params: JSON.stringify(currentRouteParams),
                                history_state: JSON.stringify(currentLocation.state),
                            },
                        });
                    });
                    app.store.dispatch(navigationPreventionAction(false));
                }
            }

            componentWillUnmount() {
                if (lifecycleListener.onDestroy.isLifecycle) {
                    app.store.dispatch(actions.onDestroy());
                }

                const currentLocation = (this.props as any).location;
                if (currentLocation) {
                    // Only cancel navigation prevention if current component is connected to <Route>
                    app.store.dispatch(navigationPreventionAction(false));
                }

                app.logger.info({
                    action: `${moduleName}/@@DESTROY`,
                    info: {
                        tick_count: this.tickCount.toString(),
                        staying_second: ((Date.now() - this.mountedTime) / 1000).toFixed(2),
                    },
                });

                try {
                    this.lastDidUpdateSagaTask?.cancel();
                    this.lifecycleSagaTask?.cancel();
                } catch (e) {
                    // In rare case, it may throw error, just ignore
                }
            }

            render() {
                return <ComponentType {...this.props} />;
            }

            private *lifecycleSaga() {
                /**
                 * CAVEAT:
                 * Do not use <yield* executeAction> for lifecycle actions.
                 * It will lead to cancellation issue, which cannot stop the lifecycleSaga as expected.
                 *
                 * https://github.com/redux-saga/redux-saga/issues/1986
                 */
                const props = this.props as RouteComponentProps & P;

                const enterActionName = `${moduleName}/@@ENTER`;
                if (lifecycleListener.onEnter.isLifecycle) {
                    const startTime = Date.now();
                    yield rawCall(executeAction, enterActionName, lifecycleListener.onEnter.bind(lifecycleListener), props);
                    app.logger.info({
                        action: enterActionName,
                        elapsedTime: Date.now() - startTime,
                        info: {
                            component_props: JSON.stringify(props),
                        },
                    });
                } else {
                    app.logger.info({
                        action: enterActionName,
                        info: {
                            component_props: JSON.stringify(props),
                        },
                    });
                }

                if (lifecycleListener.onLocationMatched.isLifecycle) {
                    if ("match" in props && "location" in props) {
                        const initialRenderActionName = `${moduleName}/@@LOCATION_MATCHED`;
                        const startTime = Date.now();
                        const routeParams = props.match.params;
                        yield rawCall(executeAction, initialRenderActionName, lifecycleListener.onLocationMatched.bind(lifecycleListener), routeParams, props.location);
                        app.logger.info({
                            action: initialRenderActionName,
                            elapsedTime: Date.now() - startTime,
                            info: {
                                route_params: JSON.stringify(props.match.params),
                                history_state: JSON.stringify(props.location.state),
                            },
                        });
                    } else {
                        console.error(`[framework] Module component [${moduleName}] is non-Route, use onEnter() instead of onLocationMatched()`);
                    }
                }

                if (moduleName === startupModuleName) {
                    // 分析首屏加载
                    createStartupPerformanceLog(`${moduleName}/@@STARTUP_PERF`);
                }

                if (lifecycleListener.onTick.isLifecycle) {
                    const tickIntervalInMillisecond = (lifecycleListener.onTick.tickInterval || 5) * 1000;
                    const boundTicker = lifecycleListener.onTick.bind(lifecycleListener);
                    const tickActionName = `${moduleName}/@@TICK`;
                    while (true) {
                        yield rawCall(executeAction, tickActionName, boundTicker);
                        this.tickCount++;
                        yield delay(tickIntervalInMillisecond);
                    }
                }
            }
        };
    }
}

function createStartupPerformanceLog(actionName: string): void {
    if (window.performance && performance.timing) {
        // For performance timing API, please refer: https://www.w3.org/blog/2012/09/performance-timing-information/
        const now = Date.now();
        const perfTiming = performance.timing;
        const baseTime = perfTiming.navigationStart;
        const duration = now - baseTime;
        const stats: {[key: string]: number} = {};

        const createStat = (key: string, timeStamp: number) => {
            if (timeStamp >= baseTime) {
                stats[key] = timeStamp - baseTime;
            }
        };

        createStat("http_start", perfTiming.requestStart);
        createStat("http_end", perfTiming.responseEnd);
        createStat("dom_start", perfTiming.domLoading);
        createStat("dom_content", perfTiming.domContentLoadedEventEnd); // Mostly same time with domContentLoadedEventStart
        createStat("dom_end", perfTiming.loadEventEnd); // Mostly same with domComplete/loadEventStart

        const slowStartupThreshold = app.loggerConfig?.slowStartupThreshold || 5;
        if (duration / 1000 >= slowStartupThreshold) {
            app.logger.warn({
                action: actionName,
                elapsedTime: duration,
                stats,
                errorCode: "SLOW_STARTUP",
                errorMessage: `Startup took ${(duration / 1000).toFixed(2)} sec, longer than ${slowStartupThreshold}`,
            });
        } else {
            app.logger.info({
                action: actionName,
                elapsedTime: duration,
                stats,
            });
        }
    }
}
