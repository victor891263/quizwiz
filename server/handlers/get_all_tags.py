from models.Test import Test
from flask import jsonify
import json

def get_all_tags():
    tests = Test.objects().only('tags')

    # create an empty set to store unique tags
    all_tags_set = set()

    # add the tags from each test to the set
    for test in tests:
        all_tags_set.update(test['tags'])

    # convert the set back to a list
    all_tags = list(all_tags_set)

    return jsonify(all_tags)
