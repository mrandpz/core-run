import {race,call,all,delay,Log, Lifecycle, Loading, Module, register, SagaGenerator,RetryOnNetworkConnectionError} from "core-fe";
import { getError, getProductList,handleDelete } from "service/ProductApi";
import { doSomeCanNotSeePeople } from "../../decorator/doSome";
import {RootState} from "type/state";
import ProductListComponent from "./component/ProductList";

export const LOADING_PRODUCT_LIST = "product/list";
export const LOADING_PRODUCT_DELETE = "product/delete";

class ProductModule extends Module<RootState, "product", {}, {}> {
    @Loading(LOADING_PRODUCT_LIST)
    *loadProductList(): SagaGenerator {
        const response = yield* call(getProductList);
        this.setState({
            productList: response,
        });
    }

    // 因为是demo，所以只注释
    // @Loading(LOADING_PRODUCT_DELETE)
    // *deleteProduct(id): SagaGenerator {
    //     const response = yield* call(handleDelete,{id});
    //     if(response.message === 'success'){
    //         yield* this.loadProductList();
    //     }
    // }

    // 重复请求，参数配置是几秒请求一次。没有终止次数
    @RetryOnNetworkConnectionError(2)
    *loadErrorRetry(): SagaGenerator {
        const response = yield* call(getError);
    }

    @Lifecycle()
    @doSomeCanNotSeePeople()
    *onLocationMatched(): SagaGenerator {
        console.log("onLocationMatched");
        throw new Error('some error')
    }

    @Lifecycle()
    @Log()
    *onEnter(): SagaGenerator {
        console.log('onEnter')
        // ? 一个报错，另外一个就受影响
        // yield* all([this.loadProductList(),this.loadErrorRetry()])

        // yield* this.loadProductList();
        // yield delay(5000)
        // yield* this.loadErrorRetry();

        yield* this.loadProductList();
    }
}

const module = register(new ProductModule("product", {}));
export const actions = module.getActions();
export const ProductList = module.attachLifecycle(ProductListComponent);
