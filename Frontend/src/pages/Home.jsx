import React, { useState, useRef, useEffect } from "react";
import { Upload_document } from "../components/Upload_document";
import { RiStarSmileLine } from "react-icons/ri";
import {
  askQuestion,
  deleteDocument,
  getDocuments,
} from "../api";

// --------------------------------------------------
// Text formatter
// --------------------------------------------------

function parseInlineBold(line, keyPrefix) {
  const parts = line
    .split(/(\*\*[^*]+\*\*)/g)
    .filter((p) => p !== "");

  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong
        key={`${keyPrefix}-${i}`}
        className="font-semibold text-gray-900 dark:text-white"
      >
        {part.slice(2, -2)}
      </strong>
    ) : (
      <React.Fragment key={`${keyPrefix}-${i}`}>
        {part}
      </React.Fragment>
    )
  );
}

function renderFormattedAnswer(text) {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const blocks = [];
  let currentList = null;

  const flushList = () => {
    if (!currentList) return;

    const Tag = currentList.type;

    blocks.push(
      <Tag
        key={blocks.length}
        className={
          Tag === "ol"
            ? "list-decimal pl-5 mb-3 space-y-1.5 text-gray-700 dark:text-gray-200"
            : "list-disc pl-5 mb-3 space-y-1.5 text-gray-700 dark:text-gray-200"
        }
      >
        {currentList.items.map((item, i) => (
          <li key={i}>
            {parseInlineBold(
              item,
              `li-${blocks.length}-${i}`
            )}
          </li>
        ))}
      </Tag>
    );

    currentList = null;
  };

  lines.forEach((line) => {
    const numberedMatch = line.match(/^\d+\.\s+(.*)/);
    const bulletMatch = line.match(/^[-*]\s+(.*)/);

    if (numberedMatch) {
      if (!currentList || currentList.type !== "ol") {
        flushList();
        currentList = {
          type: "ol",
          items: [],
        };
      }

      currentList.items.push(numberedMatch[1]);
    } else if (bulletMatch) {
      if (!currentList || currentList.type !== "ul") {
        flushList();
        currentList = {
          type: "ul",
          items: [],
        };
      }

      currentList.items.push(bulletMatch[1]);
    } else {
      flushList();

      blocks.push(
        <p
          key={blocks.length}
          className="mb-3 last:mb-0 leading-7 text-gray-700 dark:text-gray-200"
        >
          {parseInlineBold(
            line,
            `p-${blocks.length}`
          )}
        </p>
      );
    }
  });

  flushList();

  return blocks;
}

// --------------------------------------------------
// Home
// --------------------------------------------------

export const Home = () => {
  const [document, setDocument] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [documents, setDocuments] = useState([]);
  const [documentsLoading, setDocumentsLoading] = useState(true);

  const scrollRef = useRef(null);

  // Scroll chat to bottom
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // Load documents
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const data = await getDocuments();
        setDocuments(data);
      } catch (error) {
        console.error(
          "Failed to load documents:",
          error
        );
      } finally {
        setDocumentsLoading(false);
      }
    };

    loadDocuments();
  }, []);

  // --------------------------------------------------
  // Ask question
  // --------------------------------------------------

  async function handleAsk(e) {
    e.preventDefault();

    const query = input.trim();

    if (!query || isAsking || !document) return;

    setInput("");

    setMessages((m) => [
      ...m,
      {
        role: "question",
        text: query,
      },
    ]);

    setIsAsking(true);

    try {
      const result = await askQuestion({
        query,
        documentId: document.documentId,
      });

      setMessages((m) => [
        ...m,
        {
          role: "answer",
          text: result.answer,
        },
      ]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          role: "answer",
          text: "Couldn't reach the server for an answer.",
          isError: true,
        },
      ]);
    } finally {
      setIsAsking(false);
    }
  }

  // --------------------------------------------------
  // Delete active document
  // --------------------------------------------------

  async function handleDelete() {
    if (!document || isDeleting) return;

    const confirmed = window.confirm(
      `Delete "${document.filename}" permanently? This removes it from the server and can't be undone.`
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      await deleteDocument(document.documentId);

      setDocument(null);
      setMessages([]);

      setDocuments((prev) =>
        prev.filter(
          (item) => item.id !== document.documentId
        )
      );
    } catch (err) {
      alert(
        "Couldn't delete the document. Check the server logs."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  // --------------------------------------------------
  // Delete document from sidebar
  // --------------------------------------------------

  async function handleDeleteDocument(doc) {
    const confirmed = window.confirm(
      `Delete "${doc.file_name}" permanently?`
    );

    if (!confirmed) return;

    try {
      await deleteDocument(doc.id);

      setDocuments((prev) =>
        prev.filter((item) => item.id !== doc.id)
      );

      if (document?.documentId === doc.id) {
        setDocument(null);
        setMessages([]);
        setInput("");
      }
    } catch (error) {
      console.error(
        "Failed to delete document:",
        error
      );

      alert(
        "Couldn't delete the document. Please try again."
      );
    }
  }

  // --------------------------------------------------
  // Select document
  // --------------------------------------------------

  function selectDocument(doc) {
    setDocument({
      documentId: doc.id,
      filename: doc.file_name,
      pages: doc.page_count,
    });

    setMessages([]);
    setInput("");
  }

  // --------------------------------------------------
  // Upload callback
  // --------------------------------------------------

  async function handleUploaded(uploadedDocument) {
    setDocument(uploadedDocument);
    setMessages([]);

    try {
      const data = await getDocuments();
      setDocuments(data);
    } catch (error) {
      console.error(
        "Failed to refresh documents:",
        error
      );
    }
  }

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-950 transition-colors duration-200">

      <div className="flex w-full min-h-[calc(100vh-64px)]">

        {/* ==========================================
            MAIN CONTENT
        ========================================== */}

        <main className="flex-1 min-w-0 p-3 sm:p-4 lg:p-6">

          <div className="w-full min-h-[calc(100vh-100px)] rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col overflow-hidden">

            {/* ======================================
                HEADER
            ====================================== */}

            <div className="p-4 sm:p-5 lg:p-6 border-b border-gray-200 dark:border-gray-800">

              <div className="flex items-start justify-between gap-4">

                <div className="min-w-0">

                  <div className="flex items-center gap-2 sm:gap-3">

                    <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-950/50">

                      <RiStarSmileLine className="text-xl sm:text-2xl text-violet-600 dark:text-violet-400" />

                    </div>

                    <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                      Chat with your PDF
                    </h1>

                  </div>

                  <p className="mt-2 text-xs sm:text-sm lg:text-base text-gray-500 dark:text-gray-400 max-w-2xl">
                    Ask anything about your uploaded PDF
                    documents and get instant answers.
                  </p>

                </div>

              </div>

            </div>

            {/* ======================================
                CONTENT
            ====================================== */}

            <div className="flex-1 min-h-0 p-3 sm:p-4 lg:p-6">

              {!document ? (

                /* ==================================
                   UPLOAD STATE
                ================================== */

                <div className="flex min-h-[400px] sm:min-h-[500px] items-center justify-center">

                  <div className="w-full max-w-2xl">

                    <Upload_document
                      onUploaded={handleUploaded}
                    />

                  </div>

                </div>

              ) : (

                /* ==================================
                   CHAT STATE
                ================================== */

                <div className="h-full min-h-[500px] flex flex-col rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 overflow-hidden">

                  {/* Active document */}

                  <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">

                    <div className="h-9 w-9 shrink-0 rounded-lg bg-violet-100 dark:bg-violet-950/50 flex items-center justify-center">
                      <span className="text-sm">PDF</span>
                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {document.filename}
                      </p>

                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {document.pages || 0} page(s)
                      </p>

                    </div>

                  </div>

                  {/* Messages */}

                  <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-5 space-y-5"
                  >

                    {messages.length === 0 && (

                      <div className="h-full min-h-[300px] flex items-center justify-center">

                        <div className="text-center max-w-md">

                          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-violet-100 dark:bg-violet-950/50 flex items-center justify-center">

                            <RiStarSmileLine className="text-2xl text-violet-500" />

                          </div>

                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            Ask a question about your document
                          </h3>

                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Ask questions about the content
                            of your PDF and I'll find the
                            relevant information.
                          </p>

                        </div>

                      </div>

                    )}

                    {messages.map((m, i) => (

                      <div
                        key={i}
                        className={`flex ${
                          m.role === "question"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >

                        <div
                          className={`max-w-[90%] sm:max-w-[80%] lg:max-w-[75%] ${
                            m.role === "question"
                              ? "rounded-2xl rounded-br-md bg-violet-600 text-white px-4 py-3"
                              : "rounded-2xl rounded-bl-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-4 py-3"
                          }`}
                        >

                          <p
                            className={`text-xs mb-1 ${
                              m.role === "question"
                                ? "text-violet-200"
                                : "text-gray-400"
                            }`}
                          >
                            {m.role === "question"
                              ? "You"
                              : "AI Assistant"}
                          </p>

                          {m.role === "answer" &&
                          !m.isError ? (

                            <div className="text-sm sm:text-base">
                              {renderFormattedAnswer(
                                m.text
                              )}
                            </div>

                          ) : (

                            <p
                              className={
                                m.isError
                                  ? "text-red-500 text-sm"
                                  : "text-sm font-medium"
                              }
                            >
                              {m.text}
                            </p>

                          )}

                        </div>

                      </div>

                    ))}

                    {isAsking && (

                      <div className="flex justify-start">

                        <div className="rounded-2xl rounded-bl-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-4 py-3">

                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Reading your document...
                          </p>

                        </div>

                      </div>

                    )}

                  </div>

                  {/* Input */}

                  <form
                    onSubmit={handleAsk}
                    className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
                  >

                    <div className="flex flex-col sm:flex-row gap-2">

                      <input
                        value={input}
                        onChange={(e) =>
                          setInput(e.target.value)
                        }
                        placeholder="Ask a question about this document..."
                        className="flex-1 min-w-0 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition"
                      />

                      <button
                        type="submit"
                        disabled={
                          isAsking ||
                          !input.trim()
                        }
                        className="w-full sm:w-auto rounded-xl bg-violet-600 hover:bg-violet-700 px-6 py-3 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isAsking
                          ? "Thinking..."
                          : "Ask"}
                      </button>

                    </div>

                  </form>

                </div>

              )}

            </div>

          </div>

        </main>

        {/* ==========================================
            RIGHT SIDEBAR
        ========================================== */}

        <aside className="hidden xl:block w-80 shrink-0 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Information
          </h2>

          {/* Recent Chats */}

          <div className="mt-5 space-y-4">

            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 p-4">

              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Recent Chats
              </h3>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">

                {messages.filter(
                  (m) => m.role === "question"
                ).length === 0
                  ? "No recent conversations."
                  : `${
                      messages.filter(
                        (m) =>
                          m.role === "question"
                      ).length
                    } question(s) asked.`}

              </p>

            </div>

            {/* Sources */}

            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 p-4">

              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Current Source
              </h3>

              {document ? (

                <div className="mt-2">

                  <p className="text-sm font-medium text-gray-900 dark:text-white break-words">
                    {document.filename}
                  </p>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {document.pages || 0} page(s)
                  </p>

                </div>

              ) : (

                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  No document selected.
                </p>

              )}

            </div>

            {/* Documents */}

            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 p-4">

              <div className="flex items-center justify-between">

                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Your Documents
                </h3>

                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {documents.length}
                </span>

              </div>

              {documentsLoading ? (

                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  Loading documents...
                </p>

              ) : documents.length === 0 ? (

                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  No documents uploaded yet.
                </p>

              ) : (

                <div className="mt-3 space-y-2">

                  {documents.map((doc) => {

                    const isActive =
                      document?.documentId ===
                      doc.id;

                    return (

                      <div
                        key={doc.id}
                        onClick={() =>
                          selectDocument(doc)
                        }
                        className={`flex items-center gap-2 rounded-lg border p-3 cursor-pointer transition ${
                          isActive
                            ? "border-violet-500 bg-violet-50 dark:bg-violet-950/30"
                            : "border-gray-200 dark:border-gray-700 hover:border-violet-400 bg-white dark:bg-gray-900"
                        }`}
                      >

                        <div className="min-w-0 flex-1">

                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {doc.file_name}
                          </p>

                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {doc.page_count || 0} pages ·{" "}
                            {doc.chunk_count || 0} chunks
                          </p>

                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDocument(doc);
                          }}
                          className="shrink-0 text-xs text-red-500 hover:text-red-600 dark:hover:text-red-400"
                        >
                          Delete
                        </button>

                      </div>

                    );
                  })}

                </div>

              )}

            </div>

          </div>

          {/* Actions */}

          {document && (

            <div className="mt-5 space-y-2">

              <button
                onClick={() => {
                  setDocument(null);
                  setMessages([]);
                  setInput("");
                }}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:border-violet-500 hover:text-violet-500 transition"
              >
                Upload a different document
              </button>

              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full rounded-lg border border-red-300 dark:border-red-900/60 text-red-500 py-2.5 text-sm hover:bg-red-50 dark:hover:bg-red-950/30 transition disabled:opacity-50"
              >
                {isDeleting
                  ? "Deleting..."
                  : "Delete this document"}
              </button>

            </div>

          )}

        </aside>

      </div>
    </div>
  );
};