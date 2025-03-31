## **Problem Statement** : 

With the aim of protecting the planet and reducing the greenhouse effect, electric cars have emerged. Despite being uncommon at first, they are now gradually becoming more and more popular, reaching a worldwide market share of 12.4% in 2023. However, despite being innovative, we encounter several challenges when dealing with them, including the management of the electrical grid at charging stations.

In the transportation sector, electric vehicles (EVs) are a popular solution towards reducing greenhouse gas (GHG). Adopting them allows us to consume electricity from a renewable source rather than traditional car fuel. However, the feasibility of the solution relies on its scalability, especially when considering the energy that EV charging demands. If EV charging occurs at a time and a place that was not given enough voltage, the power grid faces unexpected demand which can cause blackouts. So EV scaling implies that we need to forecast its load on the grid to accommodate them and prevent blackouts. An electric vehicle’s consumption is around 17 kWh/100 km. This high energy demand leads to grid overloads during peak hours from 6 p.m. to 9 p.m. Consequently, some charging stations overheat due to excessive use. In early October 2023, about 6% of electric vehicle charging stations were damaged.

Moreover, an abrupt introduction of electric vehicles can lead to unintended consequences. For instance, in France, the rushed launch of the Autolib' rental service without adapted infrastructure led to the rapid degradation of the charging stations and to the company’s closure in 2018 after significant financial loss. Whereas in the United States, more precisely in San Francisco, it was perceived as a profitable business therefore some private companies have entered this market like Volta, which had 110 charging stations in 2015, and Chargepoint which was founded in 2007. As a result, we have witnessed a saturation of public charging stations and a lack of standardization. Finally, in Shenzhen, China’s case, the rapid transition to electric buses without sufficient charging infrastructure has led to long queues at the charging stations, disrupting the public transportation.

As such, the goal of this project is to create visualizations from EV charging data to assist power grid management by facilitating surveillance of public charging stations which are known to be points of high consumption.


## **Target Audience** : 

Our primary audience would be entities responsible for power grid management, for instance City of Palo Alto Utilities. 
They will use these visualizations to manage electricity distribution around the city by identifying where and when there is demand and how much.

## **Related Work** : 

On one hand, our project was highly inspired by the following website.
http://teamdatahub.github.io/
It has mainly inspired the structure and functionality of our website as we based ourselves off the ‘overview’ and when ‘pages’ for our visualization page. Their work and used libraries are well documented in the process book and guided our writing of our scoping document. Though we deal with the topic of transportation, we do not work with bikes, their paths and their users but rather stations and their energy consumption. 
On the other hand, this website https://www.storytellingwithdata.com/blog/2019/7/15/recapping-radials inspired one of our visualizations, the radial clock chart, which we used to showcase the peak time of day for energy consumption. And as for its code, we based it off of the following StackOverflow page: https://stackoverflow.com/questions/58545545/d3-linear-radial-clock

## **Data Sources** : 

Our project uses the EV Charging Station Usage Dataset from Palo Alto Open Data, an initiative undertaken by the city of Palo Alto, California, aimed at promoting transparency, accountability, and innovation through the provision of accessible and comprehensive datasets to the public. 
The dataset is unstructured with 259415 observations, it has what we need in terms of recorded energy consumption, time variables and station coordinates. There are even variables on GHG saved and Gasoline saved that can be used to highlight the impact of EVs, so suffice to say, for our purposes it has all we need. The minor caveat is that date variables are in different time zones and are stored as strings, likewise for time variables. In our exploratory data analysis (EDA), we processed them using the datetime library which allows us to convert strings into a formatted datetime.
At some point, we reworked the EDA with better methods. Where we used to eliminate rows with missing values, we now impute to maintain the size of our dataset. 

## **Team Organization** : 

Boudsa, Design, research and documentation
Selina, Development
Noura, Data preprocessing
Though we have assigned roles, we prefer to work together in real life at every step of the project so everyone has a part in each aspect. 
This March, we had to organize teamwork around fasting hours. As such, the real life meetings are set in the mornings, otherwise Boudsa works on the projects in the afternoon in order to assign tasks to the others after sundown.

