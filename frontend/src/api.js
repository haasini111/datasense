// Change this URL every time you restart your Colab notebook
const BASE_URL = "https://thrive-cyclist-endpoint.ngrok-free.dev";

export const api = {
  async uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${BASE_URL}/upload`, { method: "POST", body: formData });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async generatePlan(sessionId, problemStatement) {
    const res = await fetch(`${BASE_URL}/generate-plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, problem_statement: problemStatement })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async execute(sessionId, acceptedStepIds) {
    const res = await fetch(`${BASE_URL}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, accepted_step_ids: acceptedStepIds })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async downloadCsv(sessionId) {
    const res = await fetch(`${BASE_URL}/download/${sessionId}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cleaned_data.csv";
    a.click();
  },

  async chat(sessionId, message) {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, message })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async applyChatAction(sessionId, action) {
    const res = await fetch(`${BASE_URL}/apply-chat-action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, action })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
};