"use client"

import { useMemo } from "react"
import type { Json } from "@/lib/supabase/types"

interface TiptapNode {
  type: string
  content?: TiptapNode[]
  text?: string
  attrs?: Record<string, string | number | boolean>
  marks?: { type: string; attrs?: Record<string, string> }[]
}

interface PostContentProps {
  content: Json
}

export function PostContent({ content }: PostContentProps) {
  const renderedContent = useMemo(() => {
    if (!content || typeof content !== "object") return null

    const renderNode = (node: TiptapNode, index: number): React.ReactNode => {
      switch (node.type) {
        case "doc":
          return (
            <div key={index} className="prose prose-stone max-w-none">
              {node.content?.map((child, i) => renderNode(child, i))}
            </div>
          )

        case "paragraph":
          if (!node.content || node.content.length === 0) {
            return <p key={index} className="my-4">&nbsp;</p>
          }
          return (
            <p key={index} className="my-4 text-[#37322f] leading-relaxed">
              {node.content?.map((child, i) => renderNode(child, i))}
            </p>
          )

        case "heading":
          const level = node.attrs?.level || 1
          const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements
          const headingClasses = {
            1: "text-3xl font-instrument-serif mt-8 mb-4 text-[#37322f]",
            2: "text-2xl font-instrument-serif mt-6 mb-3 text-[#37322f]",
            3: "text-xl font-semibold mt-5 mb-2 text-[#37322f]",
          }
          return (
            <HeadingTag
              key={index}
              className={headingClasses[level as 1 | 2 | 3] || headingClasses[3]}
            >
              {node.content?.map((child, i) => renderNode(child, i))}
            </HeadingTag>
          )

        case "bulletList":
          return (
            <ul key={index} className="list-disc pl-6 my-4 space-y-2 text-[#37322f]">
              {node.content?.map((child, i) => renderNode(child, i))}
            </ul>
          )

        case "orderedList":
          return (
            <ol key={index} className="list-decimal pl-6 my-4 space-y-2 text-[#37322f]">
              {node.content?.map((child, i) => renderNode(child, i))}
            </ol>
          )

        case "listItem":
          return (
            <li key={index}>
              {node.content?.map((child, i) => renderNode(child, i))}
            </li>
          )

        case "blockquote":
          return (
            <blockquote
              key={index}
              className="border-l-4 border-[#37322f]/20 pl-4 my-4 italic text-[#605A57]"
            >
              {node.content?.map((child, i) => renderNode(child, i))}
            </blockquote>
          )

        case "codeBlock":
          const code = node.content
            ?.map((child) => child.text || "")
            .join("")
          return (
            <pre
              key={index}
              className="bg-[#37322f] text-white rounded-lg p-4 my-4 overflow-x-auto text-sm font-mono"
            >
              <code>{code}</code>
            </pre>
          )

        case "horizontalRule":
          return <hr key={index} className="my-8 border-t border-[#E0DEDB]" />

        case "image":
          return (
            <figure key={index} className="my-6">
              <img
                src={node.attrs?.src as string}
                alt={node.attrs?.alt as string || ""}
                className="rounded-lg max-w-full h-auto mx-auto"
              />
              {node.attrs?.title && (
                <figcaption className="text-center text-sm text-[#605A57] mt-2">
                  {node.attrs.title as string}
                </figcaption>
              )}
            </figure>
          )

        case "text":
          let textElement: React.ReactNode = node.text

          if (node.marks) {
            node.marks.forEach((mark) => {
              switch (mark.type) {
                case "bold":
                  textElement = <strong key={`${index}-bold`}>{textElement}</strong>
                  break
                case "italic":
                  textElement = <em key={`${index}-italic`}>{textElement}</em>
                  break
                case "strike":
                  textElement = <s key={`${index}-strike`}>{textElement}</s>
                  break
                case "code":
                  textElement = (
                    <code
                      key={`${index}-code`}
                      className="bg-[#f7f5f3] text-[#37322f] px-1.5 py-0.5 rounded text-sm font-mono"
                    >
                      {textElement}
                    </code>
                  )
                  break
                case "link":
                  textElement = (
                    <a
                      key={`${index}-link`}
                      href={mark.attrs?.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#37322f] underline underline-offset-2 hover:text-[#605A57] transition-colors"
                    >
                      {textElement}
                    </a>
                  )
                  break
              }
            })
          }

          return <span key={index}>{textElement}</span>

        default:
          return null
      }
    }

    return renderNode(content as unknown as TiptapNode, 0)
  }, [content])

  return <>{renderedContent}</>
}
