# WhatsApp AI Sales Agent — ARQ ONE AI Labs

Interactive demo showing how an agentic AI handles complete WhatsApp sales cycles.

## Deploy to Vercel

```bash
npm install
npx vercel
```

Or push to GitHub and import in Vercel dashboard.

## Local Development

```bash
npm install
npm run dev
```

## Customize

- Replace `91XXXXXXXXXX` in App.jsx footer with your WhatsApp number
- Edit scenarios in `getScenarios()` function to match your client's products
- Three languages built in: English, Hindi, Gujarati

## What the demo shows

Three-panel layout:
1. **Left**: WhatsApp chat (what the customer sees)
2. **Middle**: AI brain (simple visual steps — what the AI is doing)
3. **Right**: Live results (actual email, quotation PDF, CRM record, follow-up schedule)

Built by ARQ ONE AI Labs.
