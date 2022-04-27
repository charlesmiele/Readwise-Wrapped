document.querySelector('button').addEventListener('click', function () {
    // FIRST FIND PAGE COUNT
    const token = document.querySelector('input').value

    const params1 = new URLSearchParams({
        "page_size": 1,
        "highlighted_at__gt": "2021-01-01T00:00:00Z"
    })
    const url1 = `https://readwise.io/api/v2/highlights/?${ params1.toString() }`
    const otherPram = {
        headers: {
            'Authorization': 'Token ' + token
        }
    }
    const quotes = []
    const book_count = []
    fetch(url1, otherPram)
        .then(data => {
            return data.json()
        })
        .then(res => {
            var count = res['count']
            const pages = Math.ceil(count / 1000)
            for (let i = 1; i <= pages; i++) {
                const params2 = new URLSearchParams({
                    "page_size": 1000,
                    "highlighted_at__gt": "2021-01-01T00:00:00Z",
                    "page": i
                })
                const url2 = `https://readwise.io/api/v2/highlights/?${ params2.toString() }`
                fetch(url2, otherPram)
                    .then(data => {
                        return data.json()
                    })
                    .then(res => {
                        for (const x of res['results']) {
                            let quote = {
                                'text': x['text'],
                                'length': x['text'].length,
                                'book_id': parseInt(x['book_id'])
                            }
                            quotes.push(quote)
                            book_count[x['book_id']] = get(book_count, x['book_id'], 0) + 1
                        }
                        if (quotes.length === count) {

                            // SORT BOOK COUNTS
                            book_count_list = []
                            for (const x in book_count) {
                                book_count_list.push({
                                    'id': parseInt(x),
                                    'count': book_count[x]
                                })
                            }
                            book_count_list.sort((a, b) => {
                                return b.count - a.count
                            })
                            quotes.sort((a, b) => {
                                return b.length - a.length
                            })
                            const topFiveBooks = book_count_list.slice(0, 5)

                            const smallFiveQuotes = quotes.slice(-5);
                            const bigFiveQuotes = quotes.slice(0, 5);

                            const params3 = new URLSearchParams({
                                "page_size": 1
                            })
                            const url3 = `https://readwise.io/api/v2/books/?${ params3.toString() }`
                            // Find how many pages you need
                            fetch(url3, otherPram)
                                .then(data => {
                                    return data.json()
                                })
                                .then(res => {
                                    const pages2 = Math.ceil(res['count'] / 1000)
                                    for (let i = 1; i <= pages2; i++) {
                                        const params4 = new URLSearchParams({
                                            "page_size": 1000,
                                        })
                                        const url4 = `https://readwise.io/api/v2/books/?${ params4.toString() }`
                                        fetch(url4, otherPram)
                                            .then(data => {
                                                return data.json()
                                            })
                                            .then(res => {
                                                const finalTopFiveBooks = []
                                                const finalSmallFiveQuotes = []
                                                const finalBigFiveQuotes = []
                                                for (const book of res['results']) {
                                                    for (const x of topFiveBooks) {
                                                        if (x['id'] === book['id']) {
                                                            const newBook = {
                                                                'title': book['title'],
                                                                'author': book['author'],
                                                                'id': book['id'],
                                                                'highlight_count': x['count']
                                                            }
                                                            finalTopFiveBooks.push(newBook)
                                                        }
                                                    }
                                                }
                                                for (const book of res['results']) {
                                                    for (const x of bigFiveQuotes) {
                                                        if (x['book_id'] === book['id']) {
                                                            const newHighlight = {
                                                                'title': book['title'],
                                                                'author': book['author'],
                                                                'id': book['id'],
                                                                'highlight': x['text']
                                                            }
                                                            finalBigFiveQuotes.push(newHighlight)
                                                        }
                                                    }
                                                }
                                                for (const book of res['results']) {
                                                    for (const x of smallFiveQuotes) {
                                                        if (x['book_id'] === book['id']) {
                                                            const newHighlight = {
                                                                'title': book['title'],
                                                                'author': book['author'],
                                                                'id': book['id'],
                                                                'highlight': x['text']
                                                            }
                                                            finalSmallFiveQuotes.push(newHighlight)
                                                        }
                                                    }
                                                }
                                                console.log(finalTopFiveBooks)
                                                console.log(finalBigFiveQuotes)
                                                console.log(finalSmallFiveQuotes)

                                                // HTML FOR TOP 5 BOOKS
                                                const bookDiv = document.querySelector('.topBook')
                                                const bookTable = document.createElement('table')
                                                const h1Book = document.createElement('h1')
                                                const h1BookText = document.createTextNode('Your top books of 2021')
                                                h1Book.appendChild(h1BookText)
                                                bookDiv.appendChild(h1Book)
                                                bookDiv.appendChild(bookTable)
                                                for (const book of finalTopFiveBooks) {
                                                    const tr = document.createElement('tr')
                                                    const title = document.createElement('td')
                                                    title.innerHTML = `<i>${book['title']},</i> ${book['author']}`
                                                    const highlight = document.createElement('td')
                                                    const highlightCount = document.createTextNode(book['highlight_count'])
                                                    highlight.classList.add('highlightCount')
                                                    highlight.appendChild(highlightCount)
                                                    tr.appendChild(title)
                                                    tr.appendChild(highlight)
                                                    bookTable.appendChild(tr)
                                                }
                                                const smallHigh = document.querySelector('.smallHigh')
                                                const h1small = document.createElement('h1')
                                                h1small.innerText = 'Your smallest highlights from 2021'
                                                smallHigh.appendChild(h1small)
                                                for (const quote of finalSmallFiveQuotes) {
                                                    const highlight = document.createElement('div')
                                                    highlight.classList.add('highlight')
                                                    const text = document.createElement('p')
                                                    text.innerHTML = `<em>${quote['highlight']}</em>`
                                                    const source = document.createElement('p')
                                                    source.classList.add('source')
                                                    source.innerHTML = `<em>${quote['title']},</em> ${quote['author']}`
                                                    highlight.appendChild(text)
                                                    highlight.appendChild(source)
                                                    smallHigh.appendChild(highlight)
                                                }
                                                const bigHigh = document.querySelector('.bigHigh')
                                                const h1big = document.createElement('h1')
                                                h1big.innerText = 'Your biggest highlights from 2021'
                                                bigHigh.appendChild(h1big)
                                                for (const quote of finalBigFiveQuotes) {
                                                    const highlight = document.createElement('div')
                                                    highlight.classList.add('highlight')
                                                    const text = document.createElement('p')
                                                    text.innerHTML = `<em>${quote['highlight']}</em>`
                                                    const source = document.createElement('p')
                                                    source.classList.add('source')
                                                    source.innerHTML = `<em>${quote['title']},</em> ${quote['author']}`
                                                    highlight.appendChild(text)
                                                    highlight.appendChild(source)
                                                    bigHigh.appendChild(highlight)
                                                }
                                            })
                                    }
                                })


                        }
                    })
            }
        })
        .catch(error => console.log(error))
})

function get(object, key, default_value) {
    var result = object[key];
    return (typeof result !== "undefined") ? result : default_value;
}