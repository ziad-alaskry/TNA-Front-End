from crewai import Agent, Task, Crew, LLM
import os

# 1. Configure the LLM to use DeepSeek's API
# Replace 'YOUR_DEEPSEEK_API_KEY' with your actual key
deepseek_llm = LLM(
    model="deepseek/deepseek-chat", 
    api_key="sk-87aafb45227c47bb8e1ea2fa09f9a868",
    base_url="https://api.deepseek.com"
)

# 2. Define the Agent
# We now use deepseek_llm here
senior_frontend_dev = Agent(
    role='Senior Frontend Developer',
    goal='Analyze the current directory, implement carrier management features, ensure orange theme, and add a language toggle.',
    backstory="""You are a senior web developer expert in React and Node.js. 
    You prioritize clean code, responsive design, and robust data structures. 
    You are currently tasked with building a carrier management system with 
    specific UI/UX requirements.""",
    llm=deepseek_llm,
    verbose=True
)

# 3. Define the Task
task_implement_features = Task(
    description="""
    1. Analyze the current directory structure for the frontend project.
    2. Implement carrier management features in the codebase.
    3. Ensure the UI theme uses the required orange branding.
    4. Integrate a language toggle button (Arabic/English) for the interface.
    """,
    expected_output="A summary of the changes made to the codebase and confirmation that the orange theme and language toggle are implemented.",
    agent=senior_frontend_dev
)

# 4. Form the Crew and Execute
tna_crew = Crew(
    agents=[senior_frontend_dev],
    tasks=[task_implement_features],
    verbose=True
)

if __name__ == "__main__":
    print("🚀 Starting TNA Project Agentic Workflow with DeepSeek...")
    result = tna_crew.kickoff()
    print("\n\n########################")
    print("## EXECUTION RESULT")
    print("########################\n")
    print(result)