import axios from "axios";
import { getAccessToken } from "./auth";

const base_url = "https://crypto-smart-trading.onrender.com/api/chat";

const token = getAccessToken();

export const chatService = {
  ask(session_id: string | null, message: string){
    const body = {
      session_id: session_id,
      message: message
    }
    console.log("", body)
    return axios.post(`${base_url}/ask`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export type ChatResponse = {
  sessionId: string | null;
  userMessage: string;
  assistantMessage: string;
  timestamp: Date;
}
