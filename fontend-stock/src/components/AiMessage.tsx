import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const AiMessage = ({ content }: { content: string }) => {
    return (
        <div className="ai-message">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');

                        return !inline && match ? (
                            <SyntaxHighlighter
                                style={materialDark as any}
                                language={match[1]}
                                PreTag="div"
                                customStyle={{
                                    borderRadius: '10px',
                                    padding: '16px',
                                    margin: '12px 0',
                                    background: '#0a0a0a',
                                    border: '1px solid #1f1f1f'
                                }}
                                {...props}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        ) : (
                            <code
                                className={className}
                                style={{
                                    backgroundColor: '#1f1f1f',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    color: '#ff9cf0',
                                    fontFamily: 'ui-monospace, monospace',
                                }}
                                {...props}
                            >
                                {children}
                            </code>
                        );
                    },
                    // Tùy chỉnh thêm một số thẻ khác (tùy chọn)
                    p: ({ children }) => <p style={{ margin: '8px 0', lineHeight: 1.7 }}>{children}</p>,
                    ul: ({ children }) => <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>{children}</ul>,
                    ol: ({ children }) => <ol style={{ paddingLeft: '20px', margin: '8px 0' }}>{children}</ol>,
                    li: ({ children }) => <li style={{ margin: '4px 0' }}>{children}</li>,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default AiMessage;