import { supabase } from "./lib/supabase";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

async function getAccessToken() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("You are not logged in.");
  }

  return session.access_token;
}

export async function uploadDocument(file) {
  const token = await getAccessToken();

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Upload failed");
  }

  return res.json();
}

export async function askQuestion({
  query,
  documentId,
  k = 4,
}) {
  const token = await getAccessToken();

  const res = await fetch(`${API_BASE}/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query,
      document_id: documentId,
      k,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to get an answer");
  }

  return res.json();
}

export async function deleteDocument(documentId) {
  const token = await getAccessToken();

  const res = await fetch(`${API_BASE}/document/${documentId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to delete document");
  }

  return res.json();
}

export async function getDocuments() {
  const token = await getAccessToken();

  const res = await fetch(`${API_BASE}/documents`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to fetch documents");
  }

  return res.json();
}