# About this package
This package is a handler for **Agent-Based Model Simulating** in urban freights

<img src ="./readme files/map_gif.gif" alt="Loading Gif">
<a href="https://colab.research.google.com/drive/1KBMvzO4X0vVCrM3Tz1WtCO5TeJs72mNg?usp=sharing"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"></a>

# Introduction

We've been searching for a suitable and appropriate algorithm and package for finding the best path between nodes achieved from the OSM ([Open Street Map](https://www.openstreetmap.org/)) API ([Application Programming Interface](https://en.wikipedia.org/wiki/API)). Finally I found some algorithms such as [Dijkstra](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm), [Greedy](https://en.wikipedia.org/wiki/Greedy_algorithm), [Bidircetional A*](https://www.researchgate.net/publication/46434387_Yet_another_bidirectional_algorithm_for_shortest_paths) and other algorithms. The most efficient one was Bidirectional A*. I used a few packages which mentioned in **Package.json**. I update this repository gradually, but you can use Bidirectional A* method without changing the main code.

# API
## `CarHandler`
This single js([javascript](https://www.javascript.com/)) file can be used to add cars agents to the map at the point you want
### Speed
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

But, do not forget, now we have the absolute values which are not completely the correct answers. in other words, the sign of direction has been neglected. so we just need to check if the diffrential in axis is positive or not. Then multiply this sign in the achieved equations. (No need to worry, it has been done in this package already!)
## ```Agents```
Every Agent-Based package should provide its users with an API to handle the agents. In this regards, We've been working on this package to make it suitable and more simpler to users to work with. The function for handling agents are as bellow (we still are woking on some of them):

### ```addAgent(lat, lng, funcHandler, id?, name?, data?)```
### ```addAgentByNodeId(nodeId, funcHandler, id?, name?, data?)```
### ```removeAgent(id)```
### ```editAgent(id, data)```

** Question marks indicate inputting the attribute is not necessary.

## Charts
This package triggers the agents (if needed) to the charts to plot their behavious.

### ```addChart(name, chartIconPath?, location?)```

### ```removeChart(name)```

### ```triggerToChart(func, chartId)```
This function triggers ```func``` function to the chart with ```chartId``` id. the function should return 

## Change Characteristics of the Map

### ```clearScene()```
The title is actually self-explanatory: clearing what is drawn on the canvas.
### ```changeMap(newMapPath)```
In this function you are able to change the graph. Please be aware of using binary files divided into to files: one contains just nodes and another is just for ways. You do not have to put both path files to the ```changeMap```. Just put the address name without the extension.
# How to use?
After cloning this repository, open Terminal(in Mac) or Command Prompt(in Windows), go to the root directory of downloaded repository and run bellow code:
```
npm install
```
after that you've cloned the repository, you should download the necessary packages by running bellow line in command-line in the directory that files have been located:
```
npm run start
```
