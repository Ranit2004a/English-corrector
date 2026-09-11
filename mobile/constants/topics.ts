import { Topic } from '../types';

export const PRACTICE_TOPICS: Topic[] = [
  // Everyday
  {
    id: 'daily_life',
    title: 'Daily Life & Routines',
    subtitle: 'Morning habits, schedules, and everyday routines',
    category: 'Everyday',
    icon: 'wb_sunny',
    starter_prompt: "Tell me, how does a typical morning start for you?"
  },
  {
    id: 'food_dining',
    title: 'Food & Cooking',
    subtitle: 'Favorite meals, dining out, and recipes',
    category: 'Everyday',
    icon: 'restaurant',
    starter_prompt: "What is your absolute favorite dish to eat or cook?"
  },
  {
    id: 'travel_cities',
    title: 'Travel & Exploration',
    subtitle: 'Vacations, discovering new cities, and packing',
    category: 'Everyday',
    icon: 'flight_takeoff',
    starter_prompt: "If you could book a flight anywhere in the world right now, where would you go?"
  },
  {
    id: 'coffee_culture',
    title: 'Coffee & Informal Chats',
    subtitle: 'Cafe conversations, relaxing, and small talk',
    category: 'Everyday',
    icon: 'coffee',
    starter_prompt: "Do you like spending time in coffee shops? What's your usual order?"
  },
  {
    id: 'hobbies_leisure',
    title: 'Hobbies & Passions',
    subtitle: 'Music, gaming, outdoor activities, and books',
    category: 'Everyday',
    icon: 'sports_esports',
    starter_prompt: "What hobbies or activities do you enjoy doing during your free time?"
  },

  // Professional
  {
    id: 'job_interview',
    title: 'Job Interview Practice',
    subtitle: 'Role pitching, answering difficult questions, and career goals',
    category: 'Professional',
    icon: 'work_outline',
    starter_prompt: "Welcome to the interview! Can you introduce yourself and walk me through your background?"
  },
  {
    id: 'teamwork_projects',
    title: 'Teamwork & Projects',
    subtitle: 'Overcoming challenges and collaborating with peers',
    category: 'Professional',
    icon: 'groups',
    starter_prompt: "Can you tell me about a time you worked on a challenging project with a team?"
  },
  {
    id: 'workplace_communication',
    title: 'Workplace Communication',
    subtitle: 'Giving constructive feedback and leading discussions',
    category: 'Professional',
    icon: 'forum',
    starter_prompt: "How do you prefer communicating important updates to your colleagues?"
  },

  // Advanced
  {
    id: 'ai_technology',
    title: 'AI & The Future of Tech',
    subtitle: 'Automation, ethics, and future societal impacts',
    category: 'Advanced',
    icon: 'smart_toy',
    starter_prompt: "Do you believe artificial intelligence will create more opportunities or challenges for future generations?"
  },
  {
    id: 'climate_sustainability',
    title: 'Climate & Sustainability',
    subtitle: 'Renewable energy, urban ecology, and environment',
    category: 'Advanced',
    icon: 'eco',
    starter_prompt: "In your perspective, what is the most important environmental issue we face today?"
  },

  // Free Conversation
  {
    id: 'free_talk',
    title: 'Open Conversation',
    subtitle: 'Talk about anything on your mind with no agenda',
    category: 'Free Conversation',
    icon: 'record_voice_over',
    starter_prompt: "Hello! I'm Echo. What is on your mind today? Feel free to speak about whatever you like."
  }
];
