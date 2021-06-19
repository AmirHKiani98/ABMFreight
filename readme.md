# About this package
This a package is a handler for **Agent-Based Model Simulating** for Urban Freight, Transportation

<img src ="./readme files/map_gif.gif" alt="Loading Gif">

# About the graphs

I've been searching for a suitable and appropriate algorithm for finding the best path between nodes which achieved from the OSM ([Open Street Map](https://www.openstreetmap.org/)) API ([Application Programming Interface](https://en.wikipedia.org/wiki/API)). Finally I found some algorithms such as [Dijkstra](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm), [Greedy](https://en.wikipedia.org/wiki/Greedy_algorithm), [Bidircetional A*](https://www.researchgate.net/publication/46434387_Yet_another_bidirectional_algorithm_for_shortest_paths) and other algorithms. The most efficient one was Bidirectional A*. I used a few packages which mentioned in **Package.json**. I update this repository gradually, but you can use Bidirectional A* method without changing the main code.

# CarHandler
This single js([javascript](https://www.javascript.com/)) file can be used to add cars agents to the map at the point you want
## Speed
As you may know, the speed in two dimensions can be calculated as:

<img src="https://latex.codecogs.com/svg.latex?\Large&space;(\frac{dx}{dt})^2+(\frac{dy}{dt})^2=v^2" title="\Large x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}" />

And also if we have a straight way, so we have a triangle like this:


<img src="./readme files/speed-triangle.png" width=200 />

So, if we have the first and the last point coordinates, we can say:


<img src='https://latex.codecogs.com/svg.latex?\Large&space;\frac{\Delta%20x}{\Delta%20y}%20=%20\frac{dx}{dy}' title="\Large x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}" />


Which can be write as:

<img src="https://latex.codecogs.com/svg.latex?\Large&space;dx=\frac{\Delta%20x}{\Delta%20y}dy" title="\Large x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}" />

So, we can use this last equation in the first equation mentioned before:

<img src="https://latex.codecogs.com/svg.latex?\Large&space;\frac{\Delta%20x^2}{\Delta%20y^2}dy(\frac{dy}{dt})^2+(\frac{dy}{dt})^2=v^2" title="\Large x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}" />
<br>
<br>
<img src="https://latex.codecogs.com/svg.latex?\Large&space;|\frac{dy}{dt}|%20=%20\frac{v}{(\sqrt{\frac{\Delta%20x^2}{\Delta%20y^2}%20+%201})}" title="\Large x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}" />

And finally we have:

<img src="https://latex.codecogs.com/svg.latex?\Large&space;y_2%20=%20y_1%20+%20\frac{v}{(\sqrt{\frac{\Delta%20x^2}{\Delta%20y^2}%20+%201})}%20(t_2%20-%20t_1)" title="\Large x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}" />

The mentioned equations can be used for x direction. So we should have:

<img src="https://latex.codecogs.com/svg.latex?\Large&space;x_2%20=%20x_1%20+%20\frac{v}{(\sqrt{\frac{\Delta%20y^2}{\Delta%20x^2}%20+%201})}%20(t_2%20-%20t_1)" title="\Large x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}" />

BUT, do not forget, now we have tha absolute values which is not completely the correct answers. in other words, the sign of direction has been neglected. so we just need to check if the diffrential in axis is positive or not. Then multiply this sign in the achieved equations.
# How to use?
After cloning this repository, open Terminal(in Mac) or Command Prompt(in Windows), go to the root directory of downloaded repository and run bellow code:
```
npm install
```
after the download is completed, try to packing the codes into the main.js file by running:
```
npm run start
```