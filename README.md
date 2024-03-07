# Hydropower Fleet Intelligence

---

## Data

This project currently runs with a synthetic dataset that contains only a generic facility list and generator nameplate data. Other analysis functions that can be used require more datasets. At this point in time, data formatting has not been automated. If you would like to use your own datasets to view the full functionality of the application currently developed, you will need to reach out to developers to assist you. Please reach out to Pradeep Ramuhalli, ramuhallip@ornl.gov to inquire.

## Running the Application

First, create a fork of this repository to your own GitHub account.

There are two methods by which you can run this project locally:
1. Spin up docker containers using the source code (this is the recommended option)
2. Install the javascript packages and python environment on your own machine

For either method, installation steps are written based upon the use of VS Code as your IDE, however you may use another IDE if preferable. You may install VS Code [here](https://code.visualstudio.com/). 

The applicaton front end is configured to run on `localhost` at port 3000 and it forwards API requests to the backend running on port 5000 of `localhost`.

### Method One: Docker Containers

The easiest way to run the project is to install [Docker Desktop](https://www.docker.com/products/docker-desktop/). At the time of this writing, Docker Desktop is free for organizations that have less than 250 employees or make less than 10 million in annual revenue.

Once installed:
1. Run the Docker application and make sure you are logged in. 
2. Open up VS Code and create a clone of the fork so you can run the application locally. 
3. In VS Code, istall the Docker extension from the Extension menu on the left-hand side. This is optional but it will allow you to view and interact with running docker containers and images without having to leave the VS Code.
4. In VS Code, go to the Terminal menu (up top) and choose "New Terminal" if you do not already have a terminal window open
5. In the terminal window, make sure you are in the root folder of the project, if not, change directories to the root
6. Run `docker compose up -d` in the terminal window. After awhile you should see a message that says a network was created and two containers have been started. The two docker containers are:
    1. `hfi-frontend` - the application UI and its necessary files and packages will be installed in this container
    2. `hfi-backend` - the python environment necessary to run this application plus API endpoints will be installed in this container
7. If you navigate to the Docker extension on the left-hand side menu (if you installed it), you should see that two containers are running. Here you can start and stop the containers, delete docker images, etc.
8. Open a browser and navigate to http://localhost:3000. After a moment, the application will load.
9. To stop and remove the docker containers, run `docker compose down`. This will not remove the docker images, only the containers. If you want to start the containers again later, run `docker compose up -d` again and navigate again to http://localhost:3000.

### Method Two: Install Javascript Packages and Python Environment Locally

This application makes use of many third-party javascript packages as well as python libraries. [Node.js](https://nodejs.org/en/download/) is used to obtain javascript packages. For the Python environment, a .yml file is provided to import the environment using [conda](https://conda.io/projects/conda/en/latest/user-guide/install/index.html) or [mamba](https://mamba.readthedocs.io/en/latest/installation/mamba-installation.html). Using `pip` is not suggested.

1. Open up VS Code and create a clone of the fork so you can run the application locally.
2. In VS Code, go to the Terminal menu (up top) and choose "New Terminal" if you do not already have a terminal window open
3. In the terminal window, make sure you are in the root folder of the project, if not, change directories to the root
4. Determine if you have `node` and `npm` installed on your machine. Run `node -v` in the terminal window, ensure that it returns 20.11.0 or above. Run `npm -v` in your terminal window, ensure that it returns 10.2.4 or above. If these commands return nothing, install [Node.js](https://nodejs.org/en/download/).
5. Run `npm install --legacy-peer-deps` to install the node modules from the package.json file.
6. Once those have installed without error, install the python environment using the `hfi_env.yml` file found in the root folder of the project. Run `conda env create --name hfi_env -f hfi_env.yml`. 
7. Activate the environment by running `conda activate hfi_env`.
8. Run the backend of the project: `flask -app run run`. You should see a message appear that says a development server is running on http://127.0.0.1:5000. 
9. Leave the python terminal window open and open a new terminal window in VS Code. Run `npm run start`. A message should appear that says "Local: http://localhost:3000" with some other information about compilation. Either click the link or open a browser and navigate to http://locahost:3000 to view the application.
10. To stop the application, in the terminal window type Ctrl + C. Switch to the python terminal window and do the same. If you want to restart the application later, follow steps 7-9.

---

This project is still under continuous development and not all features may work as expected. 

**Submitted issues and pull requests are not actively monitored or reviewed.**