import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface MarkdownViewerProps {
  content: string
  className?: string
}

export function MarkdownViewer({ content, className = "" }: MarkdownViewerProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
        h1: ({ node, ...props }) => (
          <h1 className="text-2xl font-bold mb-4 mt-6 text-foreground" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-xl font-bold mb-3 mt-5 text-foreground" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-lg font-semibold mb-2 mt-4 text-foreground" {...props} />
        ),
        h4: ({ node, ...props }) => (
          <h4 className="text-base font-semibold mb-2 mt-3 text-foreground" {...props} />
        ),
        p: ({ node, ...props }) => <p className="mb-3 text-sm leading-relaxed text-foreground" {...props} />,
        ul: ({ node, ...props }) => <ul className="mb-3 space-y-1" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-3 space-y-1" {...props} />,
        li: ({ node, ...props }) => <li className="text-sm text-foreground" {...props} />,
        strong: ({ node, ...props }) => <strong className="font-semibold text-foreground" {...props} />,
        em: ({ node, ...props }) => <em className="italic" {...props} />,
        blockquote: ({ node, ...props }) => (
          <blockquote className="border-l-4 border-primary pl-4 italic my-3 text-muted-foreground" {...props} />
        ),
        code: ({ node, inline, ...props }: any) =>
          inline ? (
            <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
          ) : (
            <code className="block bg-muted p-3 rounded-lg text-sm font-mono overflow-x-auto my-3" {...props} />
          ),
        hr: ({ node, ...props }) => <hr className="my-4 border-border" {...props} />,
        a: ({ node, ...props }) => (
          <a className="text-primary hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
        ),
      }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

