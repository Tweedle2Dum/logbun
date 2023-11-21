## Overview

The Log Ingestor is a comprehensive system designed for the efficient ingestion, storage, and retrieval of log data. It utilises BullMQ for asynchronous writes to MongoDB, employs Redis for caching, performs indexing in MongoDB for faster searches, and maintains a keep-alive connection for live updates with filtering. In addition to the Express backend, this system is complemented by a React frontend to provide a user interface for log management.

## Architecture

The system architecture includes both backend and frontend components:

### Backend Components

1. **Express Backend**: Manages HTTP requests, log ingestion, live updates, and interfaces with BullMQ, MongoDB, and Redis.
    
2. **BullMQ**: Handles asynchronous processing of log tasks using a queue and worker system.
    
3. **MongoDB**: Serves as the primary NoSQL database for storing log data with indexing for optimised searches.
    
4. **Redis**: Acts as a caching layer for frequently accessed log data, reducing load on MongoDB.
    
5. **Cron Jobs**: Utilises `node-cron` to schedule periodic tasks, such as running the BullMQ worker.

5. **Backend port**: PORT 3000.

    

### Frontend Components

1. **React Frontend**: Provides a user interface for interacting with log data, initiating log ingestion, and configuring live updates.
    
2. **API Requests**: The React frontend communicates with the Express backend through API requests to perform log ingestion and initiate live updates.
    

## Components

### Backend Components

 **API Endpoints**
    
    - `/logs`  (POST): Handles log ingestion requests from the React frontend.
    - `/logs`  (GET): Handles log get all log requests from the React frontend.
        
    - `/logs/live` (GET): Initiates live updates with filtering based on user configurations.This method uses HTTP streaming to provide real-time updates to the frontend.
    
        

### Frontend Components

1. **React Frontend**
    
    - **Log Ingestion Interface**: Allows users to input log data and initiate log ingestion.
        
    - **Live Updates Configuration**: Provides a user interface to configure and initiate live updates with filtering.
        
    - **Data Display**: Displays log data retrieved from MongoDB with the option to filter based on various criteria.
        
    - **Integration with Backend**: Communicates with the Express backend through API requests to perform log ingestion and initiate live updates.
        
    
        

## Configuration

The system configuration, including MongoDB, Redis, and BullMQ configurations, remains centralised in the `config` folder with some utility functions for initialisation. 


## Usage

##### Initialisation 
Install the respective dependencies in the frontend and backend folder each,
use the command ``yarn install``
For running the server and frontend application , use ``yarn run dev``



---------------------------------------------------------------------
After Initialisation:

1. Send logs to the express server at localhost:300/logs (POST)
2. On frontend, you can retrieve all all logs by default on load, if you want to apply filters,
   type in the values and select the date time from the picker and click on apply filter, this will fetch the filtered data using query paramters.
3. If you want to remove the filters , click on reset filters and then apply filters to request data without any filters.
4. For live logs, go to the route /logs/live by clicking on the Live Logs button , to see logs in realtime send logs on to the /logs route in the backend (POST) . 
5. For using filters, follow same steps as 2/3 and click on apply filters after selecting them, by doing so you will only receive events with the new filter settings in real time.








## Present Issues:
1. The log ingestor endpoint is not using any validation schema, tho validation  has been configured using Zod as a validation dependency.