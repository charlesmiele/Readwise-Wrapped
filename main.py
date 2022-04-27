# Get all highlights from 2021.
# Run a for loop that creates a list of the longest highlights, the shortest highlights, and the most highlighted books

# Then get all the books highlighted in the past year.
# For each highlight, match it with an author, and create a count for the most highlighted authors.

from tokenize import Token
import requests
import pprint as pp
import math

# Put your API token here...
TOKEN = 0


def pageCount():
    querystring = {
        "page_size": 1,
        "highlighted_at__gt": "2021-01-01T21:35:53Z"
    }

    response = requests.get(
        url="https://readwise.io/api/v2/highlights/",
        headers={
            "Authorization": "Token " + TOKEN},
        params=querystring
    )

    data = response.json()
    count = data['count']
    pages = math.ceil(count/1000)
    return pages


def bigSmallBook():
    # Gets biggest quote, smallest quote, and top five book IDs with the most highlights
    # Goal: get FIVE biggest quotes(with ID), FIVE smallest quotes(with ID) and ''

    quotes = []
    book_count = {}

    for x in range(1, pageCount()+1):
        querystring = {
            "page_size": 1000,
            "page": x,
            "highlighted_at__gt": "2021-01-01T00:00:00Z"
        }
        response = requests.get(
            url="https://readwise.io/api/v2/highlights/",
            headers={
                "Authorization": "Token " + TOKEN},
            params=querystring
        )
        data = response.json()

        # MAKE DICT WITH QUOTE, LENGTH OF QUOTE, ID
        for x in data['results']:
            quote = {
                'text': x['text'],
                'length': len(x['text']),
                'book_id': x['book_id']
            }
            book_count[x['book_id']] = book_count.get(x['book_id'], 0) + 1
            quotes.append(quote)

    # RANK QUOTES BY LENGTH
    sorted_quotes = sorted(quotes, key=lambda x: x['length'])
    bigQuotes = sorted_quotes[-5:]
    smallQuotes = sorted_quotes[0:5]
    book_count = dict(
        sorted(book_count.items(), key=lambda x: x[1], reverse=True)[0:5])
    # book_count = topFive(book_count, True)
    return bigQuotes, smallQuotes, book_count


bigSmallBook = bigSmallBook()


def getBooks():
    # This function matches the book IDs with the books. It returns a list of dictionaries with books.
    querystring = {
        "page_size": 1000,
    }

    response = requests.get(
        url="https://readwise.io/api/v2/books/",
        headers={
            "Authorization": "Token " + TOKEN},
        params=querystring
    )

    data = response.json()
    print(len(data['results']))
    return data['results']


getBooks = getBooks()
newBookCount = []

# print(bigSmallBook[2])


for book in getBooks:
    if book['id'] in bigSmallBook[2]:
        newBookCount.append({
            'name': book['title'],
            'author': book['author'],
            'id': book['id'],
            'highlight_count': bigSmallBook[2][book['id']]
        })

newBigQuote = []
newSmallQuote = []
for book in getBooks:
    for x in bigSmallBook[0]:
        if x['book_id'] == book['id']:
            newBigQuote.append({
                'title': book['title'],
                'author': book['author'],
                'id': book['id'],
                'highlight': x['text']
            })

for book in getBooks:
    for x in bigSmallBook[1]:
        if x['book_id'] == book['id']:
            newSmallQuote.append({
                'title': book['title'],
                'author': book['author'],
                'id': book['id'],
                'highlight': x['text']
            })

# print(sorted(newBookCount,
#              key=lambda x: x['highlight_count']), newBigQuote, newSmallQuote)

pp.pprint(newBigQuote)

pp.pprint(newSmallQuote)
pp.pprint(newBookCount)
