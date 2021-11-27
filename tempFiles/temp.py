import numpy as np
p = np.linspace(0,1,1000)
for value in p:
    sumResult = 0
    for i in range(12):
        sumResult += 100/((1+0.35)**(i+1))
    print(sumResult)
    if(abs(sumResult-1000)/1000 < 0.01):
        print(value)
        print(sumResult)
        # break
    break