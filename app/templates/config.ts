import { SequenceTemplate } from "@/app/types";
import { translate } from "@/lib/i18n";

export const sequenceTemplates: SequenceTemplate[] = [1, 2, 3].map((index) => ({
  title: translate(`templates.template${index}.title`),
  description: translate(`templates.template${index}.description`),
  outcome: translate(`templates.template${index}.outcome`),
  steps: [1, 2, 3].map((step) => ({
    content: translate(`templates.template${index}.steps.${step}.content`),
    description: translate(
      `templates.template${index}.steps.${step}.description`
    ),
  })),
}));

// export const sequenceTemplates: SequenceTemplate[] = [
//   {
//     id: "learning-session",
//     title: "Focused Learning Session",
//     description: "Learn something without drowning in content.",
//     outcome: "One clear insight you can actually remember.",
//     steps: [
//       {
//         content: "Define what you want to learn.",
//         description: "One question, not a broad topic.",
//       },
//       {
//         content: "Consume one short resource.",
//         description: "Article, video, or chapter only.",
//       },
//       {
//         content: "Write one takeaway.",
//         description: "If you can’t write it, you didn’t learn it.",
//       },
//     ],
//   },
//   {
//     id: "important-conversation",
//     title: "Prepare an Important Conversation",
//     description: "Go in calm, clear, and intentional.",
//     outcome: "A grounded conversation without regret afterward.",
//     steps: [
//       {
//         content: "Clarify your real goal.",
//         description: "Not what you’ll say—what you want to achieve.",
//       },
//       {
//         content: "Anticipate the other side.",
//         description: "What might they fear or resist?",
//       },
//       {
//         content: "Choose one non-negotiable.",
//         description: "The line you won’t cross.",
//       },
//     ],
//   },
//   {
//     id: "work-priority-alignment",
//     title: "Work Priority Alignment",
//     description: "Cut through noise and focus at work.",
//     outcome: "Clear priorities and fewer reactive decisions.",
//     steps: [
//       {
//         content: "Identify the highest-impact task.",
//         description: "The task that justifies your day.",
//       },
//       {
//         content: "Align with expectations.",
//         description: "Who needs to be informed or aligned?",
//       },
//       {
//         content: "Define done.",
//         description: "What does ‘finished’ actually mean?",
//       },
//     ],
//   },
// ];
