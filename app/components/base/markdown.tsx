import ReactMarkdown from 'react-markdown'
import 'katex/dist/katex.min.css'
import RemarkMath from 'remark-math'
import RemarkBreaks from 'remark-breaks'
import RehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import RemarkGfm from 'remark-gfm'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atelierHeathLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import type { Components } from 'react-markdown'
import type { ReactElement } from 'react'

interface MarkdownProps {
  content: string
  components?: Record<string, React.ComponentType<any>>
}

export const Markdown = ({ content, components = {} }: MarkdownProps) => {
  const defaultComponents: Components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '')
      return (!inline && match)
        ? (
          <SyntaxHighlighter
            {...props}
            children={String(children).replace(/\n$/, '')}
            style={atelierHeathLight}
            language={match[1]}
            showLineNumbers
            PreTag="div"
          />
        )
        : (
          <code {...props} className={className}>
            {children}
          </code>
        )
    },
    pre({ children }): ReactElement {
      return <pre>{children}</pre>
    },

    span({ node, ...props }) {

      const className = node?.properties?.className
      const componentName = Array.isArray(className) ? className[0] : className

      if (typeof componentName === 'string' && components[componentName]) {
        const CustomComponent = components[componentName]
        const componentProps = Object.entries(node?.properties || {}).reduce((acc, [key, value]) => {
          if (key.startsWith('data')) {
            const propKey = key.replace('data', '').replace(/-([a-z])/g, g => g[1].toUpperCase())
            try {
              acc[propKey] = JSON.parse(value as string)
            } catch {
              acc[propKey] = value
            }
          }
          return acc
        }, {} as Record<string, any>)

        return <CustomComponent {...componentProps} {...props} />
      }
      return <span {...props} />
    }
  }

  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
        rehypePlugins={[
          RehypeKatex,
          rehypeRaw as any
        ]}
        components={defaultComponents}
        linkTarget={'_blank'}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
