from typing import List
from fastapi import APIRouter
from app.schemas.conversation import TopicItem, TopicsGroupResponse

router = APIRouter(prefix="/api/topics", tags=["Topics"])

TOPIC_CATALOG = [
    TopicsGroupResponse(
        category="Everyday",
        topics=[
            TopicItem(
                id="daily_life",
                title="Daily Life & Routines",
                subtitle="Morning habits, daily schedules, and weekend plans",
                category="Everyday",
                icon="wb_sunny",
                starter_prompt="Tell me, how does a typical morning start for you?"
            ),
            TopicItem(
                id="food_dining",
                title="Food & Dining Out",
                subtitle="Favorite dishes, cooking at home, and restaurant chats",
                category="Everyday",
                icon="restaurant",
                starter_prompt="What is your absolute favorite meal to eat or cook?"
            ),
            TopicItem(
                id="shopping_culture",
                title="Shopping & Markets",
                subtitle="Bargaining, finding clothes, and shopping online",
                category="Everyday",
                icon="shopping_bag",
                starter_prompt="Do you prefer shopping in physical stores or online? Why?"
            ),
            TopicItem(
                id="hobbies_passions",
                title="Hobbies & Free Time",
                subtitle="Music, sports, gaming, and relaxing after work",
                category="Everyday",
                icon="sports_esports",
                starter_prompt="What kind of activities help you unwind after a busy day?"
            ),
            TopicItem(
                id="family_friends",
                title="Friends & Relationships",
                subtitle="Catching up with old friends and family gatherings",
                category="Everyday",
                icon="groups",
                starter_prompt="How do you usually spend time with your closest friends?"
            ),
            TopicItem(
                id="travel_adventures",
                title="Travel & Exploration",
                subtitle="Vacations, discovering new cities, and travel tips",
                category="Everyday",
                icon="flight_takeoff",
                starter_prompt="If you could book a flight anywhere tomorrow, where would you go?"
            ),
        ]
    ),
    TopicsGroupResponse(
        category="Professional",
        topics=[
            TopicItem(
                id="job_interview",
                title="Job Interview Practice",
                subtitle="Role pitching, answering tough questions, and strengths",
                category="Professional",
                icon="work_outline",
                starter_prompt="Let's start the interview! Could you please introduce yourself and walk me through your background?"
            ),
            TopicItem(
                id="introducing_yourself",
                title="Professional Introduction",
                subtitle="Elevator pitch, sharing your expertise and current role",
                category="Professional",
                icon="badge",
                starter_prompt="How would you introduce your current role and goals in 30 seconds?"
            ),
            TopicItem(
                id="teamwork_collaboration",
                title="Teamwork & Collaboration",
                subtitle="Handling disagreements, team projects, and leadership",
                category="Professional",
                icon="handshake",
                starter_prompt="Can you describe a time when you worked on a challenging project with a team?"
            ),
            TopicItem(
                id="workplace_communication",
                title="Workplace Communication",
                subtitle="Writing emails, giving feedback, and leading meetings",
                category="Professional",
                icon="forum",
                starter_prompt="What do you find most important when communicating with colleagues remotely?"
            ),
        ]
    ),
    TopicsGroupResponse(
        category="Advanced",
        topics=[
            TopicItem(
                id="ai_technology",
                title="Artificial Intelligence & Tech",
                subtitle="Ethical dilemmas, automated future, and breakthroughs",
                category="Advanced",
                icon="smart_toy",
                starter_prompt="Do you think artificial intelligence will create more opportunities or challenges for humanity?"
            ),
            TopicItem(
                id="climate_sustainability",
                title="Climate & Sustainability",
                subtitle="Renewable energy, urban ecology, and individual action",
                category="Advanced",
                icon="eco",
                starter_prompt="In your opinion, what is the most pressing environmental issue our generation faces?"
            ),
            TopicItem(
                id="future_of_work",
                title="The Future of Work",
                subtitle="Remote culture, gig economy, and four-day workweeks",
                category="Advanced",
                icon="psychology",
                starter_prompt="How do you see the traditional 9-to-5 workplace evolving over the next decade?"
            ),
            TopicItem(
                id="society_culture",
                title="Culture & Modern Society",
                subtitle="Globalization, social media impact, and community",
                category="Advanced",
                icon="public",
                starter_prompt="How has modern social media changed the way we form relationships?"
            ),
        ]
    ),
    TopicsGroupResponse(
        category="Free Conversation",
        topics=[
            TopicItem(
                id="free_talk",
                title="Open Conversation",
                subtitle="Talk about anything on your mind with no set agenda",
                category="Free Conversation",
                icon="record_voice_over",
                starter_prompt="Hello! I'm Echo. What's on your mind today? We can talk about anything you'd like."
            )
        ]
    )
]


@router.get("", response_model=List[TopicsGroupResponse])
def get_all_topics():
    """Returns categorized list of speaking practice topics."""
    return TOPIC_CATALOG
