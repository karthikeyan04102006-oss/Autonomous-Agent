export interface ToolDefinition {
  name: string;
  category: string;
  description: string;
  requiresApproval: boolean;
  execute: (params: any) => Promise<any>;
}

export const toolRegistry: Record<string, ToolDefinition> = {
  'Google Calendar API': {
    name: 'Google Calendar API',
    category: 'Productivity',
    description: 'Queries calendar schedules, finds available time slots, and creates calendar events.',
    requiresApproval: false,
    execute: async (params: any) => {
      const time = params?.time || '3:00 PM - 4:00 PM';
      const title = params?.title || 'Team Sync & Project Alignment';
      return {
        status: 'success',
        availableSlots: ['2:00 PM', '3:00 PM', '4:30 PM'],
        selectedSlot: time,
        eventCreated: {
          id: `evt_${Date.now()}`,
          summary: title,
          start: time,
          attendees: ['team@agentflow.ai', 'alex@company.com'],
          status: 'confirmed',
          meetLink: 'https://meet.google.com/xyz-flow-agt'
        }
      };
    }
  },

  'Gmail API': {
    name: 'Gmail API',
    category: 'Communication',
    description: 'Drafts emails, searches inbox messages, and sends notifications to team members.',
    requiresApproval: true, // Sensitive action
    execute: async (params: any) => {
      const recipient = params?.recipient || 'team@agentflow.ai';
      const subject = params?.subject || 'Meeting Invite & Agenda';
      return {
        status: 'success',
        messageId: `msg_${Date.now()}`,
        recipient,
        subject,
        snippet: 'Hi team, sharing the meeting details for tomorrow afternoon as scheduled.',
        deliveredAt: new Date().toLocaleTimeString()
      };
    }
  },

  'Google Maps API': {
    name: 'Google Maps API',
    category: 'Location',
    description: 'Searches geographic locations, calculates drive/transit times, and finds top venue spots.',
    requiresApproval: false,
    execute: async (params: any) => {
      const destination = params?.destination || 'Chennai Central / City Center';
      return {
        status: 'success',
        destination,
        distance: '18.4 km',
        estimatedTravelTime: '32 minutes',
        routes: ['via Anna Salai', 'via GST Road'],
        weatherAlert: 'Clear driving conditions'
      };
    }
  },

  'Weather API': {
    name: 'Weather API',
    category: 'Utility',
    description: 'Retrieves current temperature, weather forecast, and climate warnings for any city.',
    requiresApproval: false,
    execute: async (params: any) => {
      const city = params?.city || 'Chennai';
      return {
        status: 'success',
        city,
        temp: '29°C',
        condition: 'Partly Cloudy',
        humidity: '74%',
        windSpeed: '12 km/h',
        forecast: 'Pleasant afternoon, warm evening'
      };
    }
  },

  'Flight Search API': {
    name: 'Flight Search API',
    category: 'Travel',
    description: 'Queries airline databases for real-time ticket availability, flight duration, and pricing.',
    requiresApproval: true, // Purchasing / Booking sensitivity
    execute: async (params: any) => {
      const origin = params?.origin || 'Chennai (MAA)';
      const destination = params?.destination || 'Delhi (DEL)';
      return {
        status: 'success',
        route: `${origin} ➔ ${destination}`,
        selectedFlight: {
          airline: 'IndiGo 6E-204',
          departure: '06:30 PM',
          arrival: '09:15 PM',
          duration: '2h 45m',
          fare: '₹6,250',
          seatClass: 'Economy (Flexi)'
        },
        alternatives: [
          { airline: 'Vistara UK-832', departure: '08:10 PM', fare: '₹7,100' }
        ]
      };
    }
  },

  'Hotel Search API': {
    name: 'Hotel Search API',
    category: 'Travel',
    description: 'Finds top-rated luxury and business hotels, checks room rates, and retrieves amenities.',
    requiresApproval: true,
    execute: async (params: any) => {
      const city = params?.city || 'Chennai';
      return {
        status: 'success',
        city,
        recommendedHotel: {
          name: 'Radisson Blu Hotel City Centre',
          rating: '4.8 ★',
          pricePerNight: '₹5,400',
          roomType: 'Deluxe Executive King',
          breakfastIncluded: true,
          freeCancellation: true
        }
      };
    }
  },

  'Slack / WhatsApp API': {
    name: 'Slack / WhatsApp API',
    category: 'Communication',
    description: 'Sends instant message broadcasts, team alerts, and summary updates to messaging channels.',
    requiresApproval: false,
    execute: async (params: any) => {
      return {
        status: 'success',
        channel: '#general-announcements',
        messageSent: '✅ Autonomous Agent flow successfully completed the requested task.',
        timestamp: new Date().toLocaleTimeString()
      };
    }
  },

  'Memory Tool': {
    name: 'Memory Tool',
    category: 'Core AI',
    description: 'Reads and persists user preferences, context memories, and past execution preferences.',
    requiresApproval: false,
    execute: async (params: any) => {
      return {
        status: 'success',
        preferencesLoaded: {
          preferredMeetingTime: '3:00 PM - 6:00 PM',
          preferredClass: 'Economy',
          homeLocation: 'Chennai'
        }
      };
    }
  }
};
