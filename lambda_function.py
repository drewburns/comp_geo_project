import json
import numpy as np
import matplotlib.tri as mtri
import time
from numpy.random import randint
from scipy.spatial import Delaunay
from collections import deque

###============TRIANGULATION================###

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

# Triangulate and Return Corrected Edges


def triang(pts_cc):
    x = np.asarray([pts[0] for pts in pts_cc])
    y = np.asarray([pts[1] for pts in pts_cc])

    # Modified Delauney Triangulation
    triang = our_tri(x, y, pts_cc)

    # Edge Correction
    edges = []
    tedges = triang.edges
    for i in range(len(tedges)):
        e1 = tedges[i][0]
        e2 = tedges[i][1]
        edges.append([e1, e2])
        edges.append([e2, e1])
    sort_edges = sorted(edges)
    return sort_edges

# Return Edges in Point Form


def get_edges(pts_cc):
    x = np.asarray([pts[0] for pts in pts_cc])
    y = np.asarray([pts[1] for pts in pts_cc])
    tri = our_tri(x, y, pts_cc)
    edg = tri.edges
    res = []
    pts_len = len(pts_cc)

    if len(tri.edges) == 3:
        pts_len -= 1

    for i in range(0, pts_len):
        e1 = edg[i][0]
        e2 = edg[i][1]
        p1 = []
        p2 = []
        r = []
        p1.append(int(pts_cc[e1][0]))
        p1.append(int(pts_cc[e1][1]))
        p2.append(int(pts_cc[e2][0]))
        p2.append(int(pts_cc[e2][1]))
        r.append(p1)
        r.append(p2)
        res.append(r)
    return res

# NEW - Return guard positions from points array


def guards_pos(pts_cc, color):
    guards = []
    m = min(set(color), key=color.count)

    for i in range(0, len(color)):
        if color[i] == m:
            guards.append(pts_cc[i])

    guards1 = np.array(guards)
    return guards1

###============BFS-COLORING================###
# Reference - https://www.geeksforgeeks.org/m-coloring-problem-backtracking-5/

# Node structure


class node:
    def __init__(self, id):
        self.id = id
        self.color = 1
        self.edges = []

# Return if graph can be m-colored


def canPaint(nodes, n, m):
    visited = [0]*n
    maxColors = 1

    for sv in range(0, n):
        if visited[sv] == 1:
            continue

        visited[sv] = 1
        q = deque([])
        q.append(sv)

        # BFS Travel starts here
        while len(q) != 0:
            top = q[0]
            q.popleft()

            # Checking all adjacent nodes to "top" edge in our queue
            for i in range(0, len(nodes[top].edges)):
                # IMPORTANT: If the color of the adjacent node is same, increase it by 1
                e = nodes[top].edges[i]
                if nodes[top].color == nodes[e].color:
                    nodes[e].color += 1

                # If number of colors used shoots m, return 0
                maxColors = max(maxColors, max(
                    nodes[top].color, nodes[e].color))
                if maxColors > m:
                    return 0

                # If the adjacent node is not visited, mark it visited and push it in queue
                if visited[e] == 0:
                    visited[e] = 1
                    q.append(e)
        return 1

# Return coloring list


def coloring(n, m, e):
    nodes = []
    for i in range(0, n):
        nodes.append(node(i))

    for i in range(0, len(e)):
        s = e[i][0]
        d = e[i][1]
        nodes[s].edges.append(d)

    # Run BFS
    c = canPaint(nodes, n, m)

    # Report succes/failure and return color list
    if c:
        print("Solution Exists in 3-Color")
    else:
        print("No Solution Exists in 3-Color")

    color = []
    for i in range(0, n):
        color.append(nodes[i].color)

    return color


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
    # t0 = time.time()
    tri = triang(points)
    g = coloring(len(points)-1, 3, tri)

    # runtime = time.time() - t0
    guards = guards_pos(points, g)
    edges = get_edges(points)
    return_data = dict(points=coords.tolist(),
                       guards=guards.tolist(), edges=edges)

    return {
        'statusCode': 200,
        'body': json.dumps(return_data)
    }


# lambda_handler(None,None)