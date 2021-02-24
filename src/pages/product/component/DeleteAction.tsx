import {Spin} from "antd";
import React, {useState} from "react";
import {handleDelete} from "service/ProductApi";

export interface Props {
    delteid: number | string;
    reloadList: () => void;
}
export default ({delteid, reloadList}: Props) => {
    // TODO useRequest
    const [loading, setLoading] = useState(false);
    const deleteProduct = async delteid => {
        setLoading(true);
        await handleDelete(delteid);
        setLoading(false);
        if (reloadList) {
            reloadList();
        }
    };
    return (
        <Spin spinning={loading}>
            <a onClick={() => deleteProduct(delteid)}>Delete</a>
        </Spin>
    );
};
