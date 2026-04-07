import { SendHorizontal, Square } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface ChatInputProps {
  value: string
  isLoading: boolean
  model: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  onSend: () => void
  onStop: () => void
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
}

export function ChatInput({
  value,
  isLoading,
  model,
  onChange,
  onKeyDown,
  onSend,
  onStop,
  textareaRef,
}: ChatInputProps) {
  return (
    <div className="px-4 py-3 border-t border-neutral-800 bg-[#191919] shrink-0">
      <div className="flex items-end gap-2">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          rows={1}
          placeholder="Type a message..."
          disabled={isLoading}
          aria-label="Message"
          className="flex-1 resize-none min-h-5.5 max-h-35 text-[13.5px] bg-[#1a1a1a] border-neutral-700 focus-visible:ring-0 focus-visible:border-neutral-700"
        />
        {isLoading ? (
          <button
            type="button"
            onClick={onStop}
            className="w-8 h-8 shrink-0 rounded-lg bg-(--accent) text-white flex items-center justify-center transition-colors"
            aria-label="Stop response"
            title="Stop"
          >
            <Square size={12} fill="currentColor" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onSend}
            disabled={!value.trim()}
            className="w-8 h-8 shrink-0 rounded-lg bg-violet-600 text-white flex items-center justify-center hover:bg-violet-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Send"
          >
            <SendHorizontal size={14} />
          </button>
        )}
      </div>
      <p className="text-[10px] text-neutral-600 text-center mt-2 font-mono">{model} · local</p>
    </div>
  )
}
