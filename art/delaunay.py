import numpy as np
from scipy.spatial import Delaunay
import matplotlib.pyplot as plt

points = np.array([[-66, 75], [-49,  5],[-30, -52],[ 37, 11],[ 85,  26],[ 41,  55],[-15,  71],[  4,  80],[-66,  75]])
'''
tri = Delaunay(points)
plt.triplot(points[:,0], points[:,1], tri.simplices.copy())
plt.plot(points[:,0], points[:,1], 'o')
plt.show()
'''

fig = plt.figure('Figure ')
ax = fig.add_subplot(111)
x = points[:,0]
y = points[:,1]
ax.plot(x, y, "go")
ax.fill(x, y, "r")   
ax.set_xlim(-100, 100)
ax.set_ylim(-100, 100)

tri = Delaunay(points)
simplices = list(tri.simplices.copy())

"""
n = len(points)
def contiguous(simplex):
    for i in range(len(simplex)):
        nu1 = (simplex[i] + 1) % n 
        nu2 = (simplex[i] - 1) % n 
        if nu1 not in simplex and nu2 not in simplex:
            return False
    return True

for i in range(len(simplices)-1, 0, -1):
    if not contiguous(simplices[i]):
        del simplices[i]
"""

print(simplices)
plt.triplot(points[:,0], points[:,1], simplices)

plt.show()

