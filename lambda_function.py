import json
import numpy as np
import matplotlib.tri as mtri
from numpy.random import randint


# Reference: https://www.geeksforgeeks.org/m-coloring-problem-backtracking-5/

# Split the array, triangulate, and extract all edges
def triang(pts_cc):
    # Points creation
    x = np.asarray([pts[0] for pts in pts_cc])
    y = np.asarray([pts[1] for pts in pts_cc])

    # Modified Delauney Triangulation
    # *#triang = mtri.Triangulation(x, y)
    triang = our_tri(x, y, pts_cc)

    # Edge Creation Overhead
    edges = []
    tedges = triang.edges
    for i in range(len(tedges)):
        e1 = tedges[i][0]
        e2 = tedges[i][1]
        edges.append([e1, e2])
        edges.append([e2, e1])
    sort_edges = sorted(edges)
    return sort_edges

# Determine if vertex color is identical to neighbor


def isSafe(v, color, c, E):
    sort_edges = E
    for i in range(len(sort_edges)):
        if sort_edges[i][0] == v:
            j = sort_edges[i][1]
            if color[j] == c:
                return False
    return True

# Check safety of color assignment and recursively move onto next vertex


def get_edges(pts_cc):
    x = np.asarray([pts[0] for pts in pts_cc])
    y = np.asarray([pts[1] for pts in pts_cc])
    tri = our_tri(x, y, pts_cc)
    edg = tri.edges
    res = []

    for i in range(0, len(pts_cc)):
        e1 = edg[i][0]
        e2 = edg[i][1]
        p1 = []
        p2 = []
        p1.append(int(pts_cc[e1][0]))
        p1.append(int(pts_cc[e1][1]))
        p2.append(int(pts_cc[e2][0]))
        p2.append(int(pts_cc[e2][1]))

        r = []
        r.append(p1)
        r.append(p2)
        res.append(r)
    return res


def threeColor(k, color, v, V, E):
    if v == len(V):
        return True

    for c in range(1, k + 1):
        if isSafe(v, color, c, E) == True:
            color[v] = c
            if threeColor(k, color, v + 1, V, E) == True:
                return True
            color[v] = 0

# Runs k-coloring algorithm and returns set of guard positions and their colors


def graphColor(k, V, E):
    color = [0]*len(V)
    if threeColor(k, color, 0, V, E) == None:
        return False
    print("Solution Exists")

    # Find the minimum guard positions
    guards = []

    m = min(set(color), key=color.count)
    for i in range(0, len(color)):
        if color[i] == m:
            guards.append(V[i])
    guards1 = np.array(guards)
    color1 = np.array(color)
    result = (guards1, color1)

    return result

# Build coloring list and plot


# Return guard positions from points array


def guards_pos(pts_cc, color):
    ls = []
    col = []
    for i in range(0, len(pts_cc)):
        x = []
        x.append(pts_cc[i][0])
        x.append(pts_cc[i][1])
        ls.append(x)
        col.append(color[i])

    min_color = min(set(col), key=col.count)

    for i in range(0, len(pts_cc)):
        if col[i] == min_color:
            ls[i].append("g")

    return ls


#simplices = list(tri.simplices.copy())


def our_tri(x, y, points):

    tri2 = mtri.Triangulation(x, y)
    simplices = tri2.triangles

    def isleft(a, b, c):
        det = ((b[0]-a[0])*(c[1] - a[1]) - (b[1] - a[1])*(c[0] - a[0]))
        c = [b[0], b[1]+1]
        det_test = ((b[0]-a[0])*(c[1] - a[1]) - (b[1] - a[1])*(c[0] - a[0]))

        return det*det_test > 0

    # Need to find angle from a given vertex to its two neighbors
    n = len(points) - 1
    angles = np.zeros(n)
    for i in range(n):
        # use point[i] as vertex
        # a = vector of line from point[i] to point[i+1]
        # b = vector of line from point[i] to point[i-1]
        a = points[(i+1) % n] - points[i]
        b = points[(i-1) % n] - points[i]
        # print(a,b)

        # calculate angle using |a||b|cos(angle) = a.b (two dimensions)
        dot = np.dot(a, b)
        mag_a = np.linalg.norm(a)
        mag_b = np.linalg.norm(b)
        val = dot/(mag_a*mag_b)
        angle = np.arccos(val)

        # Need to check where inside angle is
        # Points go counterclockwise
        # b is right and above i
        if b[0] > 0 and b[1] > 0:
            # is point a above line made by b?
            # if yes, then use 2pi - angle
            if isleft(b, [0, 0], a):
                angle = 2*np.pi - angle

        # b is right and below i
        if b[0] > 0 and b[1] < 0:
            # is point a above line bi?
            # if yes, then use 2pi - angle
            if isleft(b, [0, 0], a):
                angle = 2*np.pi - angle

        # b is left and above i
        if b[0] < 0 and b[1] > 0:
            # is point a above line bi?
            # if no, then use 2pi - angle
            if not isleft(b, [0, 0], a):
                angle = 2*np.pi - angle

        # b is left and below i
        if b[0] < 0 and b[1] < 0:
            # is point a above line bi?
            # if no, then use 2pi - angle
            if not isleft(b, [0, 0], a):
                angle = 2*np.pi - angle

        angles[i] = angle
    '''    
    for ang in angles:
        print(ang)
    '''

    # print()
    # Now need to compare with angles using triangles
    for i in range(n):
        for tri in simplices:
            if i in tri:
                for j in tri:
                    if j % n != i and j % n != (i-1) % n:
                        a = points[j] - points[i]
                        b = points[(i-1) % n] - points[i]
                        #print(a, b)

                        # calculate angle using
                        # |a||b|cos(angle) = a.b (two dimensions)
                        dot = np.dot(a, b)
                        mag_a = np.linalg.norm(a)
                        mag_b = np.linalg.norm(b)
                        val = dot/(mag_a*mag_b)
                        angle = np.arccos(val)

                        # if the angle of a triangle is larger
                        # than the angle of the vertex, then it
                        # is outside the shape.
                        if angle > angles[i]:
                            # print(tri)
                            simplices = [
                                x for x in simplices if not (x == tri).all()]

    tri = mtri.Triangulation(x, y, simplices)
    return tri


def lambda_handler(event, context):
    # TODO implement
    n = int(event["queryStringParameters"]['sides'])
    fi = 0
    i = 1
    fi += 1
    coords = randint(-90, 90, size=(2, n))
    x = coords[0]
    y = coords[1]
    ind = np.lexsort((y, x))
    coords = [(x[i], y[i]) for i in ind]
    x = np.asarray([c[0] for c in coords])
    y = np.asarray([c[1] for c in coords])
    pivot = coords[0]

    y_diff_pivot = y-pivot[1]
    x_diff_pivot = x-pivot[0]
    tan = (y_diff_pivot[1:]+0.0)/x_diff_pivot[1:]

    pairs = zip(tan, coords[1:])
    pairs = sorted(pairs, key=lambda t: t[0])

    coords = np.asarray([pivot])
    coords = np.append(coords, np.asarray(list(zip(*pairs))[-1]), axis=0)
    coords = np.append(coords, np.asarray([pivot]), axis=0)
    # coords = coords.tolist()

    # General Returns ##
    points = coords
    # t0 = time.time()
    tri = triang(coords)
    graph = graphColor(3, points, tri)
    guards = graph[0]
    edges = get_edges(coords)
    return_data = dict(points=coords.tolist(),
                       guards=guards.tolist(), edges=edges)

    # runtime = time.time() - t0
    return {
        'statusCode': 200,
        'body': json.dumps(return_data)
    }
