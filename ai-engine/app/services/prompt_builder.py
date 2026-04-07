import json


def build_git_system_prompt() -> str:
    return """You generate Git practice missions as structured JSON for CodeKing, a visual coding education platform.

Rules:
- Each mission has 3-5 steps that progressively teach the level's focus
- Steps must use ONLY the commands listed in the level's 'teaches' field
- Missions should use realistic scenarios (not toy examples)
- Instructions should use markdown backticks for commands like `git commit -m "message"`
- Each step's 'completedBy' must be a single valid git command
- 'alternates' are other valid ways to complete the same step
- Hints should be helpful without giving away the answer
- initialGraphState should make sense for the mission scenario
- Vary branch names, commit messages, and scenarios — don't repeat patterns
- Sort missions easiest to hardest by difficulty value
- Mission titles should be short and engaging (under 50 chars)"""


def build_dsa_system_prompt() -> str:
    return """You generate DSA prediction missions as structured JSON for CodeKing, a visual coding education platform.

Rules:
- Each mission presents an algorithm problem where the student traces execution step-by-step
- Steps should ask the student to predict what happens next in the algorithm
- Use the level's 'teaches' concepts to focus the questions
- inputData should match the algorithm type (array for search/sort, graph for BFS/Dijkstra)
- The expectedAnswer for each step should be specific and verifiable
- Keep problem sizes small enough to trace manually (arrays of 6-10 elements, graphs of 4-7 nodes)
- Vary the input data across missions — don't reuse the same arrays or graphs
- Sort missions easiest to hardest by difficulty value
- Mission titles should be short and engaging"""


def build_git_user_prompt(level_data: dict, previous_titles: list[str]) -> str:
    avoid = ""
    if previous_titles:
        avoid = f"\n\nDo NOT reuse these titles or similar first-step patterns:\n{json.dumps(previous_titles)}"

    return f"""Generate 3 Git practice missions for this level:

Title: {level_data['title']}
Focus: {level_data['focus']}
Topic: {level_data['topic']}

Commands to teach: {json.dumps(level_data['teaches'])}
Prerequisites (student already knows): {json.dumps(level_data['prerequisites'])}

Concepts to reinforce:
{chr(10).join('- ' + c for c in level_data['concepts'])}

Common mistakes to test against:
{chr(10).join('- ' + m for m in level_data['commonMistakes'])}

Real-world scenarios to draw from:
{chr(10).join('- ' + s for s in level_data['realWorldScenarios'])}

Success criteria: {level_data['successCriteria']}{avoid}"""


def build_dsa_user_prompt(level_data: dict, previous_titles: list[str]) -> str:
    avoid = ""
    if previous_titles:
        avoid = f"\n\nDo NOT reuse these titles or similar patterns:\n{json.dumps(previous_titles)}"

    ref_code = ""
    if "referenceCode" in level_data:
        ref_code = f"\n\nReference algorithm code:\n```\n{chr(10).join(level_data['referenceCode'])}\n```"

    complexity = ""
    if "complexity" in level_data:
        c = level_data["complexity"]
        complexity = f"\n\nComplexity: Time best={c['timeBest']}, avg={c['timeAverage']}, worst={c['timeWorst']}, Space={c['space']}"

    return f"""Generate 3 DSA prediction missions for this level:

Title: {level_data['title']}
Focus: {level_data['focus']}
Topic: {level_data['topic']}

Concepts to teach: {json.dumps(level_data['teaches'])}
Prerequisites: {json.dumps(level_data['prerequisites'])}

Concepts to reinforce:
{chr(10).join('- ' + c for c in level_data['concepts'])}

Common mistakes to test:
{chr(10).join('- ' + m for m in level_data['commonMistakes'])}

Real-world context:
{chr(10).join('- ' + s for s in level_data['realWorldScenarios'])}

Success criteria: {level_data['successCriteria']}{ref_code}{complexity}{avoid}"""
