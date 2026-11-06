const API_BASE = "http://127.0.0.1:8000";

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Upload failed");
  }
  return res.json(); // { documnet_id, filename, pages, message }
}

export async function askQuestion({ query, documentId, k = 4 }) {
  const res = await fetch(`${API_BASE}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, document_id: documentId, k }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to get an answer");
  }
  return res.json(); // { query, answer }
}

export async function deleteDocument(documentId) {
  const res = await fetch(`${API_BASE}/document/${documentId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to delete document");
  }
  return res.json(); // { document_id, chunks_deleted, files_removed, message }
}