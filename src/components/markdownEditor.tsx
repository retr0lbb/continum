import CodeMirror from "@uiw/react-codemirror"
import { markdown, markdownLanguage } from "@codemirror/lang-markdown"
import { syntaxHighlighting, HighlightStyle } from "@codemirror/language"
import { tags } from "@lezer/highlight"

const markdownHeadingStyle = syntaxHighlighting(
  HighlightStyle.define([
    { tag: tags.heading1, fontSize: "1.8em", fontWeight: "700", lineHeight: "1.3" },
    { tag: tags.heading2, fontSize: "1.5em", fontWeight: "700", lineHeight: "1.3" },
    { tag: tags.heading3, fontSize: "1.3em", fontWeight: "600", lineHeight: "1.3" },
    { tag: tags.heading4, fontSize: "1.1em", fontWeight: "600", lineHeight: "1.3" },
    { tag: tags.heading5, fontSize: "1em", fontWeight: "600", lineHeight: "1.3" },
    { tag: tags.heading6, fontSize: "0.9em", fontWeight: "600", lineHeight: "1.3" },
  ])
)

interface MarkdownEditorProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  minHeight?: string
}

export function MarkdownEditor({
  value = "",
  onChange,
  placeholder = "Digite aqui...",
  minHeight = "100%",
}: MarkdownEditorProps) {
  return (
    <CodeMirror
      value={value}
      height="100%"
      minWidth="100%"
      minHeight={minHeight}
      width="100%"
      placeholder={placeholder}
      theme="dark"
      extensions={[markdown({ base: markdownLanguage }), markdownHeadingStyle]}
      onChange={(value) => onChange?.(value)}
      className="w-full overflow-y-scroll border border-main-text/20 rounded"
      basicSetup={{
        lineNumbers: false,
        foldGutter: true,
        bracketMatching: true,
        closeBrackets: true,
        indentOnInput: true,
        highlightActiveLine: true,
      }}
    />
  )
}
