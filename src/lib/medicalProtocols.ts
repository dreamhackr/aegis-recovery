export const medicalProtocols = [
  {
    keywords: ["craving", "urge", "relapse", "want to use", "trigger"],
    protocol: `[MEDICAL PROTOCOL: Craving Management (Urge Surfing)]
1. Acknowledge the craving: Help the patient recognize that a craving is just a feeling, not a command.
2. Urge Surfing: Explain that urges are like ocean waves that build up, crest, and then crash. Instruct the patient to 'ride the wave' without giving in.
3. Distraction: Suggest an immediate alternative activity (e.g., calling a sponsor, going for a walk, splashing cold water on the face).
4. Delay: Ask them to wait 15 minutes before making any decisions.`
  },
  {
    keywords: ["anxious", "panic", "overwhelmed", "stress", "heart racing"],
    protocol: `[MEDICAL PROTOCOL: Emotional Stabilization (Grounding)]
1. 5-4-3-2-1 Technique: Ask the patient to name 5 things they see, 4 things they can touch, 3 things they hear, 2 things they smell, and 1 thing they can taste.
2. Box Breathing: Instruct them to inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, and hold for 4 seconds.
3. Validation: Validate their anxiety without amplifying it. Use a calm, reassuring tone.`
  },
  {
    keywords: ["withdrawal", "sick", "shaking", "sweating", "nausea"],
    protocol: `[MEDICAL PROTOCOL: Withdrawal Monitoring]
1. Symptom Check: Ask about the severity of their physical symptoms (shaking, sweating, nausea).
2. Hydration & Nutrition: Remind them to drink clear fluids and eat light, bland foods.
3. Medical Escalation: If they report severe symptoms (hallucinations, severe vomiting, chest pain), instruct them to seek immediate medical attention or call emergency services.`
  },
  {
    keywords: ["burnout", "exhausted", "tired", "caregiver", "can't do this", "frustrated"],
    protocol: `[MEDICAL PROTOCOL: Caregiver Burnout Prevention]
1. Validation: Acknowledge the extreme difficulty and emotional toll of caring for someone with SUD.
2. Boundary Setting: Remind the caregiver that they cannot control the patient's recovery, only their own boundaries. Suggest setting a firm, loving boundary today.
3. Self-Care Pivot: Ask them what they have done for themselves today. Suggest a 10-minute micro-break (e.g., stepping outside, drinking tea in silence).`
  },
  {
    keywords: ["angry", "aggressive", "yelling", "argument", "fight"],
    protocol: `[MEDICAL PROTOCOL: Crisis De-escalation (For Caregivers)]
1. Safety First: Ensure the caregiver is physically safe. If not, advise leaving the environment immediately.
2. De-escalation Script: Provide a script: "I can see you are very upset. I care about you, but I will not engage in this conversation while we are both angry. We will talk when things are calm."
3. Disengagement: Advise the caregiver to step away and not argue with a person under the influence or in severe distress.`
  }
];

export function retrieveProtocols(message: string): string {
  const lowerMessage = message.toLowerCase();
  let injectedContext = "";

  for (const item of medicalProtocols) {
    // If any keyword matches the message
    if (item.keywords.some(keyword => lowerMessage.includes(keyword))) {
      injectedContext += item.protocol + "\n\n";
    }
  }

  return injectedContext;
}
