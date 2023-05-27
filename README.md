# Information visualization project : Weather in Australia

This folder contains all the code for the project of the information visualization course.

***

## Table of contents
1. [Technologies](#technologies)
2. [Installation](#installation)
3. [Content](#content)

<a name="technologies"></a>
### Technologies

***

A list of technologies used :
- [Jupyter Notebook](https://jupyter.org/) 
- [Node.js](https://nodejs.org/en)
- HTML
- Javascript
- Bootstrap

<a name="installation"></a>

### Installation

***

As presented in the previous section, several technologies have been used in this repository : For the preprocessing part we used Jupyter Notebook and for the visualization we used Node.js for the backend (with Express.js) and HTML, js and bootstrap for the frontend.

For the Preprocessing, you just need to run it and maybe pip install some of the libraries that are mentionned in the report.

For the Visualization, you must download several modules for Node.js. All these modules are precised in the package.json and the package-lock.json files. To download them you first need to go in the Visualization folder and do the following command :

<code> npm install </code>

Once it is done, you can run the application on you localhost (port 3000 by default) with the command : 

<code> node ./backend/api/index.js </code>

[//]: <> (This section will contain the tree structure of files.)
<a name="content"></a>

### Content
***

There is two main folder : The Preprocessing and the Visualization. 

In the Preprocessing one, all the code is in the project.ipynb file. The data folder contains the datasets from Kaggle on which we are applying preprocessing.

In the Visualization one, there is one folder for the backend and one for the frontend. 

- backend is composed of : 
  - api folder : in which there is the index.js which is the api used to do our app. 
  - static folder : in which there is the preprocessed data.
  - utils folder : which provides a file in which there is a constant with the list of the different regions

- frontend is composed of : 
  - static folder : which contains the CSS (additional to bootstrap) and all the javascript used to call API and handle function of the frontend.
  - templates folder : which contain the index.html which is our main web page.


