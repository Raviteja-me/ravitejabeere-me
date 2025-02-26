import axios from 'axios';

const OPENAI_API_KEY = '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';

export const openai = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  }
});