# if Items.find().count() is 0
#   [today, now] = CurrentDay()
#   seeds = [
#     { Content: 'Text', Begin: 1 }
#     { Content: 'Chuff', Begin: 2 }
#     { Content: 'David', Begin: 3 }
#     { Content: 'Tom', Begin: 5 }
#     { Content: 'Matthew', Begin: 7 }
#     { Content: 'Stephen', Begin: 9 }
#     { Content: 'Abigail', Begin: 11 }
#   ]
#   _.each seeds, (seed) ->
#     TS = now - (1000000 * seed.Begin)
#     Items.insert {
#       Begin: TS
#       End: TS+60*60*60
#       Content: seed.Content
#     }
