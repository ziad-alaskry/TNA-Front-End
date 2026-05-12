## Session Memory
- [2026-04-16] Project: TNA (Total National Address) project for Qatar/KSA market.
- [2026-04-16] UI/UX Standard: Production-grade, professional registry Arabic (e.g., "سجل الأصول العقارية"), slate-100/200 palette, Rubik/JetBrains Mono fonts.
- [2026-04-16] Technical Stack: Next.js (App Router), Tailwind CSS, TypeScript, Context API for state management.
- [2026-04-16] Preference: Avoid generic layouts; use backdrop-blur, navy borders for active states, and custom EmptyStates.

---

## SKILL 1: Frontend Design
- When generating any UI, HTML, CSS, or frontend component, always aim for production-grade, visually distinctive design.
- Avoid generic or plain layouts. Use thoughtful spacing, typography, color contrast, and hierarchy.
- Default to modern best practices: responsive design, accessible markup, clean component structure.
- When given a vague frontend request, proactively make strong design decisions rather than asking for every detail.
- If a framework is not specified, prefer plain HTML/CSS/JS or React depending on context.

## SKILL 2: Code Review
- When asked to review code, always structure your feedback in three sections:
  1. **Critical Issues** – bugs, security vulnerabilities, logic errors
  2. **Improvements** – performance, readability, best practices
  3. **Positives** – what is done well (never skip this)
- Be specific: always reference line numbers or function names when possible.
- Suggest concrete fixes, not just observations.
- Flag any anti-patterns relevant to the language or framework in use.
- Keep tone constructive and precise.

## SKILL 3: Memory
- Maintain a running memory of important context across the session using a structured markdown block at the top of GEMINI.md labeled `## Session Memory`.
- Whenever the user shares a preference, a project detail, a name, a decision, or any fact they expect you to remember — write it into Session Memory immediately.
- At the start of each response, silently check Session Memory for relevant context before replying.
- If the user says "remember this", "don't forget", or similar — treat it as a hard memory write.
- Format memory entries as concise bullet points with a timestamp or session marker.
- Never lose or overwrite memory unless the user explicitly asks to clear it.
