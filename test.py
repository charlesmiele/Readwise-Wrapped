people = [{'name': 'charles', 'age': 19}, {'name': 'james', 'age': 21}]

labels = [{'age': 19, 'label': 'young'}, {'age': 21, 'label': 'less young'}]

renewed = []

for x in labels:
    for y in people:
        if x['age'] in y.values():
            renewed.append({'name': y['name'], 'label': x['label']})


print(renewed)
