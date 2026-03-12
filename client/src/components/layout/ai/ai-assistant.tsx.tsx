import { useState } from "react"
import { Bot, X } from "lucide-react"

export default function AIAssistant() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-(--bg-elevated) border border-(--border-subtle) rounded-xl shadow-lg flex flex-col z-50">
          
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-(--border-subtle)">
            <div className="flex items-center gap-2">
              <Bot size={18} />
              <span className="text-sm font-medium">AI Assistant</span>
            </div>

            <button onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 p-3 overflow-y-auto text-sm text-muted-foreground">
            Hello 👋  
            Ask me anything about coding.
          </div>

          {/* Input */}
          <div className="p-2 border-t border-(--border-subtle)">
            <input
              placeholder="Ask something..."
              className="w-full bg-(--bg-surface) rounded-md px-3 py-2 text-sm outline-none"
            />
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-(--accent) hover:bg-(--accent-hover) text-white flex items-center justify-center shadow-lg z-50 cursor-pointer"
      >
        <Bot size={24} />
      </button>
    </>
  )
}