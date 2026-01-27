import axios from "axios";

export const taxApi = axios.create({
    baseURL: "http://127.0.0.1:8000",
    withCredentials: true, // ✅ CORRECT PLACE
    headers: {
        "Content-Type": "application/json",
    },
});





export const askTaxGPT = async (question: string) => {

    console.log("Sending request with question:", question);

    const sessionId = localStorage.getItem("session_id");

    const response = await taxApi.post(
        "/ask",
        { question },
        {
            headers: {
                'Content-Type': 'application/json',
                ...(sessionId && { "X-Session-ID": sessionId }),
            },
        }
    );

    // 🔴 SAVE session_id returned by backend
    if (response.data.session_id) {
        localStorage.setItem("session_id", response.data.session_id);
    }


    console.log("Response headers:", response.headers);
    console.log("Response data:", response.data);

    return response.data;
};
