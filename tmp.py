import json
import io

with open('C:/Users/Kimo Store/.gemini/antigravity/brain/14fc1dc7-220e-40b9-b652-8a05bae724f9/.system_generated/steps/133/output.txt', encoding='utf-8') as f:
    text = f.read()
    data = json.loads(text)
    
with io.open('titles.txt', 'w', encoding='utf-8') as out:
    for s in data['screens']:
        out.write(s['name'] + ' | ' + s['title'] + '\n')
