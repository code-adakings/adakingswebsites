import type { PortableTextBlock } from "@/types/sanity";

export function extractPlainText(blocks: PortableTextBlock[] = []): string {
  return blocks
    .map((block) => {
      if (block._type !== "block" || !Array.isArray(block.children)) return "";
      return (block.children as { text?: string }[])
        .map((child) => child.text ?? "")
        .join("");
    })
    .join("\n");
}
