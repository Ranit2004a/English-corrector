import sys
# Set utf-8 encoding for Windows stdout
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except AttributeError:
        pass

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    print("Testing GET /health...")
    response = client.get("/health")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    data = response.json()
    print("Health response:", data)
    assert data["status"] == "healthy"
    print("[PASS] Health check passed!")

def test_topics():
    print("\nTesting GET /api/topics...")
    response = client.get("/api/topics")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    data = response.json()
    assert len(data) >= 3
    print(f"[PASS] Topics retrieved successfully! ({len(data)} categories)")

def test_conversation_message():
    print("\nTesting POST /api/conversation/message...")
    payload = {
        "session_id": "test_session_1",
        "level": "B1",
        "topic": "Daily Life",
        "message": "Yesterday I go to market and buy some fruits.",
        "history": []
    }
    response = client.post("/api/conversation/message", json=payload)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    data = response.json()
    print("AI Response:", data)
    assert "reply" in data
    assert "corrections" in data
    print("[PASS] Conversation message endpoint passed!")

def test_session_summary():
    print("\nTesting POST /api/conversation/session...")
    payload = {
        "session_id": "test_session_1",
        "topic": "Daily Life",
        "level": "B1",
        "duration_seconds": 300,
        "messages": [
            {"role": "assistant", "text": "What do you like to do on weekends?"},
            {"role": "user", "text": "I like read books and listen music."}
        ],
        "corrections_count": 1
    }
    response = client.post("/api/conversation/session", json=payload)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    data = response.json()
    print("Summary Response:", data)
    assert "grammar_score" in data
    assert "overall_score" in data
    print("[PASS] Session summary endpoint passed!")

if __name__ == "__main__":
    try:
        test_health()
        test_topics()
        test_conversation_message()
        test_session_summary()
        print("\n==========================================")
        print("ALL BACKEND API TESTS PASSED SUCCESSFULLY!")
        print("==========================================")
    except Exception as e:
        print(f"\n[FAIL] Test failed with error: {e}")
        sys.exit(1)
