import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env.js';

export interface PlannedStep {
  stepNumber: number;
  description: string;
  tool: string;
  requiresApproval: boolean;
  estimatedTime: string;
}

export interface PlanOutput {
  intent: string;
  goalSummary: string;
  steps: PlannedStep[];
}

const genAI = config.geminiApiKey ? new GoogleGenerativeAI(config.geminiApiKey) : null;

export async function generateAgentPlan(userGoal: string, memoriesContext: string = ''): Promise<PlanOutput> {
  console.log(`[Agent Planner] Decomposing user goal: "${userGoal}"`);

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
You are the Autonomous AI Agent Planner for AgentFlow.
User Goal: "${userGoal}"
Available Context/Memories: "${memoriesContext}"

Decompose this user goal into 3 to 6 logical sequential execution steps.
Available Tools to assign to each step:
- "Google Calendar API"
- "Gmail API"
- "Google Maps API"
- "Weather API"
- "Flight Search API"
- "Hotel Search API"
- "Slack / WhatsApp API"
- "Memory Tool"

Sensitive actions (booking flights, reserving hotels, sending emails to external people) MUST set "requiresApproval": true.

Return ONLY a raw JSON object with this exact schema:
{
  "intent": "Brief description of recognized user intent",
  "goalSummary": "Clear concise summary of what will be accomplished",
  "steps": [
    {
      "stepNumber": 1,
      "description": "Clear step description",
      "tool": "Exact Tool Name from available tools",
      "requiresApproval": false,
      "estimatedTime": "0.5s"
    }
  ]
}
Do NOT wrap in markdown code blocks if possible, return plain JSON text.
`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      // Clean JSON string if wrapped in backticks
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed: PlanOutput = JSON.parse(cleanJson);
      if (parsed && Array.isArray(parsed.steps) && parsed.steps.length > 0) {
        return parsed;
      }
    } catch (error) {
      console.warn('[Agent Planner] Gemini API call failed or timed out, using fallback planner:', error);
    }
  }

  // Smart Fallback Planning logic based on keyword matching
  const goalLower = userGoal.toLowerCase();

  if (goalLower.includes('chennai') || goalLower.includes('trip') || goalLower.includes('flight') || goalLower.includes('travel')) {
    return {
      intent: 'Travel & Itinerary Planning',
      goalSummary: 'Plan travel itinerary, find flights, check hotel accommodations, and verify route weather.',
      steps: [
        { stepNumber: 1, description: 'Query user preferences & location context', tool: 'Memory Tool', requiresApproval: false, estimatedTime: '0.4s' },
        { stepNumber: 2, description: 'Check destination weather & forecast', tool: 'Weather API', requiresApproval: false, estimatedTime: '0.6s' },
        { stepNumber: 3, description: 'Search flights from Chennai to destination', tool: 'Flight Search API', requiresApproval: true, estimatedTime: '1.2s' },
        { stepNumber: 4, description: 'Find top-rated executive hotel options', tool: 'Hotel Search API', requiresApproval: true, estimatedTime: '1.0s' },
        { stepNumber: 5, description: 'Calculate transit routes and map points', tool: 'Google Maps API', requiresApproval: false, estimatedTime: '0.7s' },
        { stepNumber: 6, description: 'Send travel summary confirmation via email', tool: 'Gmail API', requiresApproval: true, estimatedTime: '0.9s' }
      ]
    };
  }

  if (goalLower.includes('email') || goalLower.includes('organize') || goalLower.includes('inbox')) {
    return {
      intent: 'Email Organization & Automation',
      goalSummary: 'Scan inbox messages, summarize key items, and draft responses for urgent emails.',
      steps: [
        { stepNumber: 1, description: 'Scan unread inbox messages and flags', tool: 'Gmail API', requiresApproval: false, estimatedTime: '0.5s' },
        { stepNumber: 2, description: 'Cross-reference calendar for scheduling conflicts', tool: 'Google Calendar API', requiresApproval: false, estimatedTime: '0.8s' },
        { stepNumber: 3, description: 'Draft summary response for critical threads', tool: 'Gmail API', requiresApproval: true, estimatedTime: '1.1s' },
        { stepNumber: 4, description: 'Notify user in Slack channel', tool: 'Slack / WhatsApp API', requiresApproval: false, estimatedTime: '0.6s' }
      ]
    };
  }

  if (goalLower.includes('hotel') || goalLower.includes('stay') || goalLower.includes('resort')) {
    return {
      intent: 'Hotel Reservation & Spot Selection',
      goalSummary: 'Locate 4+ star hotels, compare pricing, and present room details.',
      steps: [
        { stepNumber: 1, description: 'Load stay budget preferences', tool: 'Memory Tool', requiresApproval: false, estimatedTime: '0.3s' },
        { stepNumber: 2, description: 'Search top hotels near city center', tool: 'Hotel Search API', requiresApproval: true, estimatedTime: '1.2s' },
        { stepNumber: 3, description: 'Verify venue distance from airport', tool: 'Google Maps API', requiresApproval: false, estimatedTime: '0.7s' }
      ]
    };
  }

  // Default: Meeting / General Task
  return {
    intent: 'Calendar & Team Scheduling',
    goalSummary: 'Identify team members, check calendar availability, create meeting slot, and dispatch invitations.',
    steps: [
      { stepNumber: 1, description: 'Identify team members and recipient contacts', tool: 'Gmail API', requiresApproval: false, estimatedTime: '0.4s' },
      { stepNumber: 2, description: 'Check Google Calendar availability slots', tool: 'Google Calendar API', requiresApproval: false, estimatedTime: '0.8s' },
      { stepNumber: 3, description: 'Find common free time slot (3:00 PM - 4:00 PM)', tool: 'Google Calendar API', requiresApproval: false, estimatedTime: '0.6s' },
      { stepNumber: 4, description: 'Create calendar event with Google Meet video link', tool: 'Google Calendar API', requiresApproval: false, estimatedTime: '1.1s' },
      { stepNumber: 5, description: 'Send invitation emails to all participants', tool: 'Gmail API', requiresApproval: true, estimatedTime: '0.9s' },
      { stepNumber: 6, description: 'Verify event creation and confirm status', tool: 'Slack / WhatsApp API', requiresApproval: false, estimatedTime: '0.5s' }
    ]
  };
}
