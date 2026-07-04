import { marked } from "marked";
import { useMemo } from "react";

marked.setOptions({ gfm: true, breaks: false });

export default function Markdown({ source, className = "" }: { source: string; className?: string }) {
  const html = useMemo(() => marked.parse(source) as string, [source]);
  return <div className={`md ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
