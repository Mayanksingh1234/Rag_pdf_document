import React, { useEffect, useState } from "react";
import { getDocuments, deleteDocument } from "../api";
import { useNavigate } from "react-router-dom";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FiSearch, FiTrash2, FiExternalLink } from "react-icons/fi";

export const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const data = await getDocuments();
      setDocuments(data);
    } catch (error) {
      console.error("Failed to load documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (doc) => {
    const confirmed = window.confirm(
      `Delete "${doc.file_name}" permanently?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(doc.id);

      await deleteDocument(doc.id);

      setDocuments((prev) =>
        prev.filter((item) => item.id !== doc.id)
      );
    } catch (error) {
      console.error("Failed to delete document:", error);
      alert("Couldn't delete the document.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleOpen = (doc) => {
    navigate("/", {
      state: {
        documentId: doc.id,
        filename: doc.file_name,
        pages: doc.page_count,
      },
    });
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.file_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 md:p-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
            Documents
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your uploaded PDF documents.
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="
            px-5 py-2.5
            rounded-lg
            bg-violet-600
            text-white
            text-sm
            font-medium
            hover:bg-violet-700
            transition
          "
        >
          + Upload Document
        </button>

      </div>

      {/* Search */}
      <div className="relative mb-7 max-w-md">

        <FiSearch
          className="
            absolute
            left-3
            top-1/2
            -translate-y-1/2
            text-gray-400
          "
        />

        <input
          type="text"
          placeholder="Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full
            pl-10
            pr-4
            py-3
            rounded-lg
            border
            border-gray-200
            dark:border-gray-700
            bg-white
            dark:bg-gray-900
            text-gray-900
            dark:text-white
            placeholder-gray-400
            outline-none
            focus:ring-2
            focus:ring-violet-500
          "
        />

      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-20">
          <p className="text-gray-500">
            Loading documents...
          </p>
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredDocuments.length === 0 && (
        <div className="
          bg-white
          dark:bg-gray-900
          border
          border-gray-200
          dark:border-gray-800
          rounded-xl
          p-12
          text-center
        ">

          <IoDocumentTextOutline
            className="mx-auto text-gray-400"
            size={48}
          />

          <h2 className="
            mt-4
            text-lg
            font-medium
            text-gray-900
            dark:text-white
          ">
            {search ? "No documents found" : "No documents yet"}
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {search
              ? "Try a different search."
              : "Upload a PDF to start chatting with it."}
          </p>

          {!search && (
            <button
              onClick={() => navigate("/")}
              className="
                mt-5
                px-5 py-2.5
                rounded-lg
                bg-violet-600
                text-white
                text-sm
                hover:bg-violet-700
                transition
              "
            >
              Upload your first PDF
            </button>
          )}

        </div>
      )}

      {/* Document cards */}
      {!loading && filteredDocuments.length > 0 && (

        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-5
        ">

          {filteredDocuments.map((doc) => (

            <div
              key={doc.id}
              className="
                bg-white
                dark:bg-gray-900
                border
                border-gray-200
                dark:border-gray-800
                rounded-xl
                p-5
                hover:shadow-md
                transition
              "
            >

              {/* Top */}
              <div className="flex items-start gap-3">

                <div className="
                  shrink-0
                  w-11
                  h-11
                  rounded-lg
                  bg-violet-100
                  dark:bg-violet-900/30
                  flex
                  items-center
                  justify-center
                  text-violet-600
                ">
                  <IoDocumentTextOutline size={23} />
                </div>

                <div className="min-w-0 flex-1">

                  <h3
                    title={doc.file_name}
                    className="
                      font-medium
                      text-gray-900
                      dark:text-white
                      truncate
                    "
                  >
                    {doc.file_name}
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    PDF Document
                  </p>

                </div>

              </div>

              {/* Details */}
              <div className="
                mt-5
                grid
                grid-cols-2
                gap-3
              ">

                <div className="
                  rounded-lg
                  bg-gray-50
                  dark:bg-gray-800
                  p-3
                ">
                  <p className="text-xs text-gray-500">
                    Pages
                  </p>

                  <p className="
                    mt-1
                    font-medium
                    text-gray-900
                    dark:text-white
                  ">
                    {doc.page_count || 0}
                  </p>
                </div>

                <div className="
                  rounded-lg
                  bg-gray-50
                  dark:bg-gray-800
                  p-3
                ">
                  <p className="text-xs text-gray-500">
                    Chunks
                  </p>

                  <p className="
                    mt-1
                    font-medium
                    text-gray-900
                    dark:text-white
                  ">
                    {doc.chunk_count || 0}
                  </p>
                </div>

              </div>

              {/* Status */}
              <div className="mt-4 flex items-center justify-between">

                <span className="text-xs text-gray-500">
                  Status
                </span>

                <span
                  className={`
                    px-2.5
                    py-1
                    rounded-full
                    text-xs
                    font-medium
                    ${
                      doc.status === "ready"
                        ? "bg-green-100 text-green-700"
                        : doc.status === "failed"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }
                  `}
                >
                  {doc.status}
                </span>

              </div>

              {/* Actions */}
              <div className="
                mt-5
                pt-4
                border-t
                border-gray-100
                dark:border-gray-800
                flex
                gap-2
              ">

                <button
                  onClick={() => handleOpen(doc)}
                  className="
                    flex-1
                    flex
                    items-center
                    justify-center
                    gap-2
                    px-3
                    py-2
                    rounded-lg
                    bg-violet-600
                    text-white
                    text-sm
                    hover:bg-violet-700
                    transition
                  "
                >
                  <FiExternalLink size={15} />
                  Open
                </button>

                <button
                  onClick={() => handleDelete(doc)}
                  disabled={deletingId === doc.id}
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    px-3
                    py-2
                    rounded-lg
                    border
                    border-red-200
                    text-red-600
                    text-sm
                    hover:bg-red-50
                    disabled:opacity-50
                    transition
                  "
                >
                  <FiTrash2 size={15} />

                  {deletingId === doc.id
                    ? "Deleting..."
                    : "Delete"}
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};