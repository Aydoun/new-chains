import { SequenceTemplate } from "@/app/types";

export const sequenceTemplates: SequenceTemplate[] = [
  {
    id: "customer-onboarding",
    title: "Customer Onboarding Welcome",
    description:
      "Kickstart a new customer relationship with a structured welcome, orientation, and first-win follow-up.",
    outcome:
      "A personalized onboarding chain that guides customers from welcome to their first successful outcome.",
    steps: [
      {
        content: "Send a warm welcome that reiterates the value they’ll get.",
        description:
          "Thank the customer for choosing us and highlight the top 2-3 outcomes they can achieve quickly.",
      },
      {
        content: "Share a guided setup checklist tailored to their goal.",
        description:
          "Link to key docs, offer a short loom, and recommend the next best action with a due date.",
      },
      {
        content: "Schedule a first-value milestone check-in.",
        description:
          "Confirm the milestone, invite stakeholders, and propose two times for a quick sync.",
      },
    ],
  },
  {
    id: "feature-launch-brief",
    title: "Feature Launch Brief",
    description:
      "Align teams on a new feature with a concise narrative, rollout plan, and guardrails.",
    outcome:
      "A crisp launch brief that stakeholders can skim to understand the what, why, and how of the release.",
    steps: [
      {
        content: "Write the one-sentence pitch and target user.",
        description:
          "Clarify the audience, the core job, and how this feature changes their workflow.",
      },
      {
        content: "Outline rollout, risks, and success criteria.",
        description:
          "List launch phases, call out top risks, and define 3-5 measurable signals of success.",
      },
      {
        content: "Draft enablement and communication notes.",
        description:
          "Capture FAQs, callouts for sales/support, and the single source of truth link.",
      },
    ],
  },
  {
    id: "research-interview-guide",
    title: "User Research Interview Guide",
    description:
      "Plan a structured interview that uncovers goals, pains, and decision signals from target users.",
    outcome:
      "A ready-to-run script that keeps interviews consistent while leaving space for probing follow-ups.",
    steps: [
      {
        content: "Define participant profile and learning goals.",
        description:
          "State who you’re talking to, what you must learn, and what decisions the research will inform.",
      },
      {
        content: "Draft opening, warm-up, and core questions.",
        description:
          "Sequence questions from context to behavior to opinion; flag any must-ask probes.",
      },
      {
        content: "Plan wrap-up and consent/logistics.",
        description:
          "Confirm recording consent, incentives, and how insights will be shared back with the team.",
      },
    ],
  },
  {
    id: "sales-discovery",
    title: "Sales Discovery Chain",
    description:
      "Guide a discovery call that surfaces pain, urgency, and success criteria before a tailored demo.",
    outcome:
      "A repeatable discovery framework with action items and agreed next steps captured for the prospect.",
    steps: [
      {
        content: "Establish context and champion motivation.",
        description:
          "Confirm the champion’s role, current process, and what triggered them to explore solutions now.",
      },
      {
        content: "Quantify pain and map impact.",
        description:
          "Capture metrics, downstream effects, and the cost of inaction using the prospect’s own language.",
      },
      {
        content: "Align on success metrics and next steps.",
        description:
          "Document desired outcomes, timeline, evaluation criteria, and schedule the follow-up demo.",
      },
    ],
  },
  {
    id: "incident-postmortem",
    title: "Incident Postmortem Template",
    description:
      "Run a blameless incident review that captures context, timeline, and clear remediation actions.",
    outcome:
      "A concise postmortem that improves reliability through root-cause clarity and accountable follow-up.",
    steps: [
      {
        content: "Summarize incident scope and impact.",
        description:
          "Describe what broke, who was affected, and the measurable customer/system impact.",
      },
      {
        content: "Reconstruct the timeline with key decisions.",
        description:
          "List detection time, mitigations attempted, communication moments, and resolution steps.",
      },
      {
        content: "Capture root cause and actions.",
        description:
          "List contributing factors, preventive fixes, owners, and due dates for each remediation item.",
      },
    ],
  },
  {
    id: "content-campaign",
    title: "Content Campaign Planner",
    description:
      "Organize a multi-asset campaign with aligned narrative, distribution, and measurement.",
    outcome:
      "A coordinated content plan that ships on schedule with clear positioning and channel owners.",
    steps: [
      {
        content: "Define the narrative and target audience.",
        description:
          "State the core promise, audience segments, and the single differentiator to emphasize.",
      },
      {
        content: "Outline assets, owners, and due dates.",
        description:
          "List articles, social cuts, email(s), and supporting creative with accountable owners.",
      },
      {
        content: "Plan distribution and measurement.",
        description:
          "Map launch dates, channels, UTMs, and the KPIs that define success for this campaign.",
      },
    ],
  },
  {
    id: "product-discovery",
    title: "Product Discovery Sprint",
    description:
      "Structure a discovery sprint that validates a problem, aligns on hypotheses, and plans experiments.",
    outcome:
      "A sprint outline with prioritized questions, experiments, and expected signals to move forward.",
    steps: [
      {
        content: "Frame the problem statement and audience.",
        description:
          "Capture the symptom, affected users, and the value at stake if solved.",
      },
      {
        content: "List hypotheses and experiments.",
        description:
          "Pair each hypothesis with the quickest test and the signal that would validate or kill it.",
      },
      {
        content: "Define decision checkpoints and owners.",
        description:
          "Assign DRI, set dates for review, and specify artifacts that must be produced each day.",
      },
    ],
  },
];
