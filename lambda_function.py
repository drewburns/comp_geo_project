import json
from numpy.random import randint
from numpy import lexsort,asarray,append

def lambda_handler(event, context):
    # TODO implement
    n = int(event["queryStringParameters"]['sides']) - 1
    fi = 0
    i = 1
    fi += 1
    coords = randint(-90,90, size=(2,n))
    x = coords[0] 
    y = coords[1]
    ind = lexsort((y,x))
    coords = [(x[i],y[i]) for i in ind] 
    x = asarray([c[0] for c in coords])
    y = asarray([c[1] for c in coords])
    pivot = coords[0]

    y_diff_pivot = y-pivot[1]
    x_diff_pivot = x-pivot[0]
    tan = (y_diff_pivot[1:]+0.0)/x_diff_pivot[1:]

    pairs = zip(tan,coords[1:])
    pairs = sorted(pairs, key = lambda t: t[0])
    
    coords = asarray([pivot])
    coords = append(coords, asarray( list(zip(*pairs))[-1]), axis=0 )
    coords = append(coords, asarray([pivot]), axis=0 )
    coords = coords.tolist()
    return {
        'statusCode': 200,
        'body': json.dumps(coords)
    }

