import {fetchStream} from './fetch-stream';

const LLM_SPLIT = "__LLM_RESPONSE__";

// 增加一个函数，用于解析追问接口返回的数据
export const parseFollowUp = async(
    controller,
    messages,
    sources,
    historyId,
    setOutput,
    onError,
    onComplete
) => {
    const decoder = new TextDecoder();
    let finalOutput = "";
    let uint8array = new Uint8Array();
    let chunks = "";
    const response = await fetch('http://127.0.0.1:5002/followup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({"messages": messages, "sources": sources}),
        signal: controller.signal,
    });
    if (response.status !== 200) {
        onError?.(response.status);
        return;
    }
    fetchStream(
        response,
        (chunk) => {
            uint8array = new Uint8Array([...uint8array, ...chunk]);
            chunks = decoder.decode(uint8array, {stream: true});
            setOutput(chunks);
            finalOutput = chunks;
        },
        ()=> {
            const chatHistory = JSON.parse(localStorage.getItem(`chatHistory`));
            const history = chatHistory.find((h) => h.key === historyId);
            history.message.push({role: 'user', content: messages[messages.length - 1]});
            history.messages.push({role: 'assistant', content: finalOutput});
            localStorage.setItem(`chatHistory`, JSON.stringify(chatHistory));
            onComplete?.();
        }
    )
}

export const parseStreaming = async(
    controller,
    query,
    historyId,
    setSources,
    setOutput,
    setMessages,
    onError,
    onComplete
) => {
    const decoder = new TextDecoder();
    let finalOutput = "";
    let finalSource = [];
    let uint8array = new Uint8Array();
    let chunks = "";
    let sourcesEmitted = false;
    const response = await fetch('http://127.0.0.1:5002/query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({"query": query}),
        signal: controller.signal,
    });
    if (response.status !== 200) {
        onError?.(response.status);
        return;
    }
    fetchStream(
        response,
        (chunk) => {
            uint8array = new Uint8Array([...uint8array, ...chunk]);
            chunks = decoder.decode(uint8array, {stream: true});
            if (chunks.includes(LLM_SPLIT)) {
                const [sources, content] = chunks.split(LLM_SPLIT);
                if (!sourcesEmitted) {
                    setSources(JSON.parse(sources).sources);
                    sourcesEmitted = true;
                }
            setOutput(content);
            finalOutput = content;
            finalSource = JSON.parse(sources).sources;
            }
        },
        ()=> {
            // 更新localStorage
            const chatHistory = JSON.parse(localStorage.getItem(`chatHistory`));
            // 找到当前的历史记录
            const history = chatHistory.find((h) => h.key === historyId);
            history.messages.push({role: 'assistant', content: finalOutput});
            history.sources = finalSource;
            localStorage.setItem(`chatHistory`, JSON.stringify(chatHistory));
            onComplete?.();

        }
    )
}