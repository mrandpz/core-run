import React from "react";
import {Table, Tag, Space, Spin} from "antd";
import useRuntimeState from "hooks/useRuntimeState";
import {useLoadingStatus} from "core-fe/hooks";
import {actions} from "pages/product";
import {LOADING_PRODUCT_DELETE, LOADING_PRODUCT_LIST} from "..";
import {DispatchProp, connect} from "react-redux";
import DeleteAction from "./DeleteAction";

interface Props extends DispatchProp {}

const ProductList = React.memo(({dispatch}: Props) => {
    const {productList = []} = useRuntimeState("product");
    const loading = useLoadingStatus(LOADING_PRODUCT_LIST);
    const deleteLoading = useLoadingStatus(LOADING_PRODUCT_DELETE);

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Expired",
            dataIndex: "expired",
            render: text => (text ? "Yes" : "No"),
        },
        {
            title: "Image",
            dataIndex: "imgUrl",
            render: text => {
                return <img src={text} alt="" width="90" />;
            },
        },
        {
            title: "Action",
            render: (text, record) => (
                <Space size="middle">
                    <a>Invite {record.name}</a>
                    <DeleteAction delteid={record.id} reloadList={() => dispatch(actions.loadProductList())} />
                </Space>
            ),
        },
    ];

    return <Table loading={loading} rowKey="id" columns={columns} dataSource={productList} />;
});

export default connect()(ProductList);
