import sys
import requests
import re

from sympy import symbols, Eq, solve

def get_wikipedia_summary(topic, lang='en'):
    url = f"https://{lang}.wikipedia.org/api/rest_v1/page/summary/{topic}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        return data['extract']
    else:
        return "Sorry, I couldn't find any information on that topic."

def solve_arithmetic(expression):
    try:
        result = eval(expression)
        return f"The result is {result}"
    except Exception as e:
        return f"Error: {e}"

def solve_equation(equation_str):
        x = symbols('x')
        equation = Eq(eval(equation_str.split('=')[0]), eval(equation_str.split('=')[1]))
        solutions = solve(equation, x)
        return f"The solutions are {solutions}"
    

def handle_query(query):
    if re.match(r'^[0-9+\-*/(). ]+$', query):
        return solve_arithmetic(query)
    elif re.match(r'^[x0-9+\-*/^=. ()]+$', query):
        return solve_equation(query)
    else:
        return get_wikipedia_summary(query)

if __name__ == '__main__':
    query = ' '.join(sys.argv[1:])
    response = handle_query(query)
    print(response)
    
