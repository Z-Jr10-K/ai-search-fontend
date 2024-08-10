import React from "react";
import {List, Typography, Skeleton } from "antd";

const {Title} = Typography;

const Sources = ({sources}) => {
    return (
        <div>
            <Title level={3}>来源</Title>
            {sources.length > 0 ? 
            (
                <List 
                    itemLayout="horizontal"
                    dataSource={sources}
                    renderItem={(item, index) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<span style={{ marginRight: 6 }}>{index + 1}</span>}
                                title={<a href={item.url} target="_blank" rel="noreferrer">{item.title}</a>}
                            />
                        </List.Item>
                    )}
                />
            ):(
                <div>
                    <Skeleton active />
                    <Skeleton active />
                    <Skeleton active />
                </div>
            )
            }
        </div>
    );
}
export default Sources;

