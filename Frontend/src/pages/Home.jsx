import React, { useState, useRef, useEffect } from 'react'
import { Navbar } from '../components/Navbar'
import { Left_component } from '../components/Left_component'
import { Upload_document } from '../components/Upload_document'
import { RiStarSmileLine } from "react-icons/ri";
import { askQuestion, deleteDocument } from '../api'

// --- Lightweight text formatter (no markdown library) ---
// Handles **bold**, numbered lists ("1. ...") and bulleted lists ("- " / "* ")

function parseInlineBold(line, keyPrefix) {
  const parts = line.split(/(\*\*[^*]+\*\*)/g).filter((p) => p !== '')
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={`${keyPrefix}-${i}`} className="font-semibold text-gray-900">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <React.Fragment key={`${keyPrefix}-${i}`}>{part}</React.Fragment>
    )
  )
}

function renderFormattedAnswer(text) {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
  const blocks = []
  let currentList = null // { type: 'ol' | 'ul', items: string[] }

  const flushList = () => {
    if (!currentList) return
    const Tag = currentList.type
    blocks.push(
      <Tag
        key={blocks.length}
        className={
          Tag === 'ol'
            ? 'list-decimal pl-5 mb-2 space-y-1 text-gray-800'
            : 'list-disc pl-5 mb-2 space-y-1 text-gray-800'
        }
      >
        {currentList.items.map((item, i) => (
          <li key={i}>{parseInlineBold(item, `li-${blocks.length}-${i}`)}</li>
        ))}
      </Tag>
    )
    currentList = null
  }

  lines.forEach((line) => {
    const numberedMatch = line.match(/^\d+\.\s+(.*)/)
    const bulletMatch = line.match(/^[-*]\s+(.*)/)

    if (numberedMatch) {
      if (!currentList || currentList.type !== 'ol') {
        flushList()
        currentList = { type: 'ol', items: [] }
      }
      currentList.items.push(numberedMatch[1])
    } else if (bulletMatch) {
      if (!currentList || currentList.type !== 'ul') {
        flushList()
        currentList = { type: 'ul', items: [] }
      }
      currentList.items.push(bulletMatch[1])
    } else {
      flushList()
      blocks.push(
        <p key={blocks.length} className="mb-2 last:mb-0 text-gray-800">
          {parseInlineBold(line, `p-${blocks.length}`)}
        </p>
      )
    }
  })
  flushList()
  return blocks
}
// --- end formatter ---

export const Home = () => {
  const [document, setDocument] = useState(null) // { documentId, filename, pages }
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isAsking, setIsAsking] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  async function handleAsk(e) {
    e.preventDefault()
    const query = input.trim()
    if (!query || isAsking || !document) return

    setInput('')
    setMessages((m) => [...m, { role: 'question', text: query }])
    setIsAsking(true)
    try {
      const result = await askQuestion({ query, documentId: document.documentId })
      setMessages((m) => [...m, { role: 'answer', text: result.answer }])
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: 'answer', text: "Couldn't reach the server for an answer.", isError: true },
      ])
    } finally {
      setIsAsking(false)
    }
  }

  async function handleDelete() {
    if (!document || isDeleting) return
    const confirmed = window.confirm(
      `Delete "${document.filename}" permanently? This removes it from the server and can't be undone.`
    )
    if (!confirmed) return

    setIsDeleting(true)
    try {
      await deleteDocument(document.documentId)
      setDocument(null)
      setMessages([])
    } catch (err) {
      alert("Couldn't delete the document. Check the server logs.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
     <div className='m-0; p-2 md:p-4 lg:px-6 lg:py-4'>
          <Navbar/>

    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <Left_component/>

      {/* Center Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="h-full rounded-xl bg-white shadow-md border border-gray-200 p-6 flex flex-col">
          <h2 className="text-lg md:text-2xl font-bold text-gray-800 flex gap-2 md:gap-3 items-center">
            Chat with your PDF <RiStarSmileLine className='text-violet-500'/>
          </h2>

          <p className="mt-4 text-gray-600">
            Ask anything about your uploaded PDF documents and get instant answers with citations. 
          </p>

          {!document ? (
            <div className="mt-8">
              <Upload_document onUploaded={setDocument} />
            </div>
          ) : (
            <div className="mt-8 flex-1 flex flex-col rounded-lg border border-gray-200 min-h-0">
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                  <p className="text-gray-400 italic">
                    Ask anything about "{document.filename}" to get started.
                  </p>
                )}
                {messages.map((m, i) => (
                  <div key={i}>
                    <span className="block text-xs text-gray-400 mb-1">
                      {m.role === 'question' ? 'You asked' : 'Answer'}
                    </span>
                    {m.role === 'answer' && !m.isError ? (
                      <div>{renderFormattedAnswer(m.text)}</div>
                    ) : (
                      <p className={m.isError ? 'text-red-500' : 'font-medium text-gray-900'}>
                        {m.text}
                      </p>
                    )}
                  </div>
                ))}
                {isAsking && <p className="text-gray-400 italic">Reading the document…</p>}
              </div>

              <form onSubmit={handleAsk} className="flex gap-2 border-t border-gray-200 p-3">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question about this document"
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-violet-500"
                />
                <button
                  type="submit"
                  disabled={isAsking || !input.trim()}
                  className="rounded-lg bg-violet-500 px-4 py-2 text-white font-medium disabled:bg-gray-300"
                >
                  Ask
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="w-80 bg-white border-l border-gray-200 p-5">
        <h2 className="text-xl font-semibold mb-5">
          Information
        </h2>

        <div className="space-y-4">
          <div className="rounded-lg bg-gray-100 p-4">
            <h3 className="font-medium">Recent Chats</h3>
            <p className="text-sm text-gray-500 mt-1">
              {messages.filter((m) => m.role === 'question').length === 0
                ? 'No recent conversations.'
                : `${messages.filter((m) => m.role === 'question').length} question(s) asked.`}
            </p>
          </div>

          <div className="rounded-lg bg-gray-100 p-4">
            <h3 className="font-medium">Sources</h3>
            {document ? (
              <div className="text-sm text-gray-600 mt-1">
                <p className="font-medium break-words">{document.filename}</p>
                <p className="text-gray-400">{document.pages} page(s)</p>
                <p className="text-gray-400 font-mono text-xs mt-1 break-all">
                  {document.documentId}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-1">
                Document references will appear here.
              </p>
            )}
          </div>

          <div className="rounded-lg bg-gray-100 p-4">
            <h3 className="font-medium">Statistics</h3>
            <p className="text-sm text-gray-500 mt-1">
              Uploaded PDFs: {document ? 1 : 0}
            </p>
          </div>
        </div>

        {document && (
          <div className="mt-6 space-y-2">
            <button
              onClick={() => { setDocument(null); setMessages([]) }}
              className="w-full text-sm rounded-lg border border-gray-300 py-2 hover:border-violet-500 hover:text-violet-500 transition"
            >
              Upload a different document
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-full text-sm rounded-lg border border-red-300 text-red-500 py-2 hover:bg-red-50 transition disabled:opacity-50"
            >
              {isDeleting ? 'Deleting…' : 'Delete this document'}
            </button>
          </div>
        )}
      </aside>
    </div>
  
    </div>
  )
}