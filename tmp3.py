import json
files = [
    'C:/Users/Kimo Store/.gemini/antigravity/brain/14fc1dc7-220e-40b9-b652-8a05bae724f9/.system_generated/steps/133/output.txt',
    'C:/Users/Kimo Store/.gemini/antigravity/brain/14fc1dc7-220e-40b9-b652-8a05bae724f9/.system_generated/steps/172/output.txt',
    'C:/Users/Kimo Store/.gemini/antigravity/brain/14fc1dc7-220e-40b9-b652-8a05bae724f9/.system_generated/steps/173/output.txt'
]

results = []
for file in files:
    try:
        with open(file, encoding='utf-8') as f:
            data = json.loads(f.read())
            for s in data.get('screens', []):
                t = s.get('title', '').lower()
                if 'forget' in t or 'forgot' in t or 'password' in t or 's16' in t:
                    results.append(s['name'] + ' | ' + s['title'])
    except Exception as e:
        pass

with open('search_results.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(results))
