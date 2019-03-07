import yaml
import os
import json

files = [x for x in os.listdir() if x[len(x)-4:]=='json']
output = {}

for file in files:
    print(file)
    with open(file) as json_file:
        for line in yaml.safe_load(json_file):
            if not line['country'] in output.keys():
                output.update({line['country'] : {}})

            for field in line:
                if not field == 'country':
                    output[line['country']].update({field: line[field]})

    
for country in output:
    print(country)
    for field in output[country]:
        print(field, ":", output[country][field])
    print("")

with open('json_combined.json', 'w') as outfile:
    json.dump(output, outfile)