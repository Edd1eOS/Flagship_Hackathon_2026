# Lemonade User And Agent Collaboration Protocol

> Applies to all implementation agents working with the user on this project.

## 1. Language Contract

- Communicate with the user in Chinese.
- Keep production documents in `docs/production/` in English.
- Keep code identifiers, comments, commit messages, UI copy, architecture diagrams, test names, and technical contracts in English.
- Historical mixed-language documents may remain unchanged unless explicitly promoted to production status.
- When translating a user requirement into an English production contract, preserve meaning rather than literal wording.

## 2. Communication Style

Communication must be:

- concise;
- factual;
- efficient;
- technically explicit;
- honest about uncertainty and verification;
- free of praise, filler, or motivational language.

Do not overwhelm the user with raw command output or implementation trivia. Explain decisions, trade-offs, risks, and outcomes that affect the product or delivery.

## 3. Progress Reporting

Report at every meaningful step:

1. before repository exploration;
2. after learning something that changes the plan;
3. before file edits;
4. after a major stage/gate;
5. before a long-running build/test/dev server action;
6. when a blocker or material risk appears;
7. after verification;
8. at final completion.

Updates should usually be one or two sentences in Chinese.

Recommended formats:

### Start

```text
I am checking <scope>, focusing on <risk/contract>. I will then change <area> and verify it with <verification>.
```

### Discovery

```text
Confirmed: <finding>. This changes the plan by <plan adjustment> and does not change <invariant>.
```

### Before edit

```text
Next I will change <files/symbols> to implement <behaviour>. <out-of-scope/invariant> remains unchanged.
```

### Verification

```text
Implementation is complete. I am running <tests/build/browser checks>; failures will be fixed before the work is marked complete.
```

### Completion

```text
Completed: <result>.
Verification: <evidence>.
Remaining risk: <material issue or none>.
```

All templates above describe content structure. The agent must render them in concise Chinese when communicating with the user.

## 4. Questions And Ambiguity

The user requests "ask whenever in doubt". Apply it to material ambiguity, not trivial implementation details.

Ask before proceeding when uncertainty affects:

- product behaviour or value proposition;
- user-visible workflow;
- financial truth;
- privacy, browser permissions, or data collection;
- destructive Git/filesystem action;
- remote repository history or push;
- public schema/API compatibility;
- visual identity or missing required asset;
- scope/deadline trade-off;
- whether a feature is P0 or cut;
- claims in the pitch/demo.

Question rules:

- ask in Chinese;
- ask one to three short related questions;
- explain the consequence of each decision;
- state the recommended option first when options exist;
- do not ask for information discoverable from the repository or official docs;
- do not repeatedly ask the same resolved question;
- record the answer in the change log/production docs.

## 5. Autonomy Rules

Proceed without asking for routine choices when:

- production docs already specify the behaviour;
- the choice is reversible and internal;
- it follows existing repository style;
- it does not alter permissions, data, scope, or user-visible semantics;
- tests can validate it.

Examples:

- file-local helper naming consistent with nearby code;
- selecting a standard Lucide icon;
- exact pure-function decomposition;
- test fixture organisation;
- minor spacing within approved layout tokens.

## 6. Honesty Rules

Always distinguish:

- planned vs implemented;
- implemented vs verified;
- simulated/seeded vs real data;
- local build vs deployed behaviour;
- AI suggestion vs deterministic rule;
- browser-page floating companion vs OS-level desktop pet;
- high-confidence controlled detection vs universal retailer support;
- planned allocation vs actual savings/transfer;
- directional waste reduction vs measured environmental impact.

Never imply an organisation, bank, marketplace, school, repair provider, or retailer integration that does not exist.

## 7. Documentation Rules

- Production docs are English.
- Update docs in the same iteration as code/contracts.
- Append every meaningful change to `02-change-log.md`.
- Update `03-dependency-map.md` with any dependency/public-boundary change.
- Keep historical exploration; mark it superseded rather than silently rewriting history.
- Use exact file/symbol names.
- Record verification commands/results, not vague "tested" statements.
- Keep one current source of truth and link to it from superseded documents.

## 8. User Update Frequency

- Send an update before beginning.
- For work exceeding approximately 30 seconds, continue updates at meaningful boundaries and at least every few minutes of active tool work.
- Do not send a message for every trivial command.
- If a long command is still running, report what it is and continue waiting; do not end the turn while required processes remain unresolved.

## 9. Final Response Rules

Final responses must:

- lead with the completed result;
- mention verification;
- link important local files with absolute paths when useful;
- disclose anything not completed or not tested;
- stay concise;
- avoid ending with a generic "if you want" offer;
- suggest only a concrete next step that follows the roadmap.

## 10. Critical Escalations

Immediately ask the user before:

- deleting/replacing a non-empty remote repository;
- force pushing or rewriting Git history;
- destructive filesystem operations;
- requesting broad `<all_urls>` extension permission beyond the agreed demo;
- sending user images/page data to an external service;
- adding authentication, bank, payment, or cloud database scope;
- changing the core value proposition;
- cutting any item listed as "Never cut" in the roadmap;
- using an unavailable/missing brand or character asset as a fabricated substitute.

## 11. Current User Preferences

- User communication: Chinese.
- Production documentation: English.
- Style: concise, efficient, constructive, honest.
- Reporting: every meaningful step.
- Questions: ask on material uncertainty.
- Technical standard: production-quality boundaries and rigorous verification, while respecting the hackathon deadline.
- Product priority: judged, demonstrable vertical slice over broad incomplete feature coverage.
