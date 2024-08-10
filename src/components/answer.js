import React from "react";
import { Skeleton } from "antd";
import Markdown  from "react-markdown";

export default function Answer({ markdown, sources }) {
    return (
        markdown ? (<Markdown
            components={{
                a: ({ node: _, ...props }) => {
                    const source = sources[+props.href - 1];
                    if (!source) return <></>;

                    return (
                        <a href={source.url} target="_blank" rel="noreferrer">
                            <sup>[{ +props.href }]</sup>
                        </a>
                    )
                },
            }}
        >{markdown}</Markdown>) : (
            <Skeleton paragraph={{ rows: 3 }} active />
        )
    )
}