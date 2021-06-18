# About
This a package for **Agent-Based** **Freight Model Simulating**

# CarHandler
This single *js* ([javascript](https://www.javascript.com/)) file can be used to add cars agents to the map at the point you want
## Speed
As you may know, the speed in two dimensions can be calculated as:

<img src="https://latex.codecogs.com/svg.latex?\Large&space;(\frac{dx}{dt})^2+(\frac{dy}{dt})^2=v^2" title="\Large x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}" />

And also if we have a straight way, so we have a triangle like this:


<img src="./readme files/speed-triangle.png" width=200 />

So, if we have the first and the last point coordinates, we can say:


<img src="https://latex.codecogs.com/svg.latex?\Large&space;\frac{\Delta x}{\Delta y} = \frac{dx}{dy}" title="\Large x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}" />


Which can be write as:

<img src="https://latex.codecogs.com/svg.latex?\Large&space;dx=\frac{\Delta x}{\Delta y}dy" title="\Large x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}" />

So, we can use this last equation in the first equation mentioned before:
<img src="https://latex.codecogs.com/svg.latex?\Large&space;\frac{\Delta x^2}{\Delta y^2}dy(\frac{dy}{dt})^2+(\frac{dy}{dt})^2=v^2" title="\Large x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}" />
<br>
<br>
<img src="https://latex.codecogs.com/svg.latex?\Large&space;|\frac{dy}{dt}| = \frac{v}{(\sqrt{\frac{\Delta x^2}{\Delta y^2} + 1})}" title="\Large x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}" />

And finally we have:

<img src="https://latex.codecogs.com/svg.latex?\Large&space;y_2 = y_1 + \frac{v}{(\sqrt{\frac{\Delta x^2}{\Delta y^2} + 1})} (t_2 - t_1)" title="\Large x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}" />

The mentioned equations can be used for x direction. So we should have:

<img src="https://latex.codecogs.com/svg.latex?\Large&space;x_2 = x_1 + \frac{v}{(\sqrt{\frac{\Delta y^2}{\Delta x^2} + 1})} (t_2 - t_1)" title="\Large x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}" />