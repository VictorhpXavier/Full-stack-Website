import sys
import requests

def get_wikipedia_summary(topic, lang='en'):
    url = f"https://{lang}.wikipedia.org/api/rest_v1/page/summary/{topic}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        return data['extract']
    else:
        return "Sorry, I couldn't find any information on that topic."

if __name__ == '__main__':
    topic = sys.argv[1]
    summary = get_wikipedia_summary(topic)
    print(summary)