import React, { useState, useRef } from 'react'
import { uploadDocument } from '../api'

export const Upload_document = ({ onUploaded }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  async function handleFile(file) {
    if (!file) return
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are supported.')
      return
    }
    setError(null)
    setIsUploading(true)
    try {
      const result = await uploadDocument(file)
      onUploaded({
        documentId: result.document_id,
        filename: result.filename,
        pages: result.pages,
      })
    } catch (err) {
      setError("Couldn't reach the server. Please try again later.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div
      className={`h-[500px] rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 transition cursor-pointer
        ${isDragging ? 'border-violet-500 bg-violet-50' : 'border-gray-300'}`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragging(false)
        handleFile(e.dataTransfer.files[0])
      }}
      onClick={() => !isUploading && inputRef.current?.click()}
      role="button"
      tabIndex={0}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        hidden
        onChange={(e) => handleFile(e.target.files[0])}
      />
      {isUploading ? (
        <p className="text-gray-500">Reading your document…</p>
      ) : (
        <>
          <p className="text-gray-600 font-medium">Drop your PDF here</p>
          <p className="text-gray-400 text-sm">or click to browse</p>
        </>
      )}
      {error && <p className="text-red-500 text-sm mt-2 px-4 text-center">{error}</p>}
    </div>
  )
}