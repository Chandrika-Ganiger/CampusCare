# CampusCare

**CampusCare - AWS-powered campus issue reporting and tracking platform**

CampusCare is a web-based platform that helps students report common campus issues and allows administrators to view and track those reports.

The project focuses on creating a simple workflow:

**Student reports an issue → Issue is stored → Admin views the issue → Admin updates the status**

---

## Problem

Campus issues such as Wi-Fi problems, faulty fans, lights, smartboards and power/socket issues are often reported through informal messages or conversations.

This can make it difficult for administrators to keep track of reported problems and for students to know whether an issue is being handled.

CampusCare provides a central platform for reporting and tracking these issues.

---

## Solution

CampusCare provides two interfaces:

### Student

Students can:

* Enter their name and email
* Select an issue category
* Enter the building and room
* Describe the problem
* Submit a campus issue

### Admin

Administrators can:

* View reported issues
* View issue details
* Filter issues by status
* Update issue status
* Add a message for the student
* View total, pending, in-progress and cleared issues

---

## Issue Status Flow

```text
Pending → In Progress → Cleared
```

When a student submits an issue, it is stored in the backend.

The administrator can then view the issue and update its status as work progresses.

---

## AWS Architecture

The application uses the following AWS services:

* **Amazon S3** – Hosts the Student and Admin frontend pages
* **Amazon API Gateway** – Provides the HTTP API endpoint
* **AWS Lambda** – Handles backend logic
* **Amazon DynamoDB** – Stores campus issue data
* **AWS IAM** – Controls permissions for Lambda to access DynamoDB

### Architecture Flow

```text
Student / Admin
       |
       v
Amazon S3
  Frontend
       |
       v
Amazon API Gateway
       |
       v
AWS Lambda
       |
       v
Amazon DynamoDB
```

The browser frontend communicates with the backend through API Gateway.

Lambda processes the request and performs the required operation on the DynamoDB table.

---

## How the Application Works

### 1. Student submits an issue

The student enters the issue details through the Student page.

The frontend sends the information to the API endpoint.

### 2. API Gateway receives the request

Amazon API Gateway provides the endpoint used by the frontend to communicate with the backend.

### 3. Lambda processes the request

AWS Lambda handles the backend operation.

For a new issue, Lambda generates an issue ID and stores the report in DynamoDB.

### 4. DynamoDB stores the issue

The issue information includes details such as:

* Issue ID
* Student name
* Student email
* Category
* Building
* Room
* Description
* Status
* Admin message
* Timestamp

### 5. Admin views and updates the issue

The Admin dashboard retrieves the stored issues through the API.

The administrator can update the status and add an admin message.

---

## AWS Permissions

AWS IAM is used to control access between the Lambda function and DynamoDB.

The Lambda execution role has the required DynamoDB permissions for the operations used by CampusCare.

This helped us understand that AWS services need the correct permissions before they can communicate with each other.

---

## CORS Configuration

Because the CampusCare frontend runs in a browser and communicates with an API hosted through API Gateway, CORS configuration was required.

We configured the API to allow the frontend to make the required requests to the backend.

Working through the CORS issue was an important part of debugging the application.

---

## Technology Stack

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* AWS Lambda
* Amazon API Gateway

### Database

* Amazon DynamoDB

### Hosting

* Amazon S3

### Access Management

* AWS IAM

---

## Project Structure

```text
CampusCare/
│
├── student.html
├── student.js
├── admin.html
├── admin.js
└── README.md
```

---

## Deployment

The frontend is deployed using Amazon S3 static website hosting.

The backend is connected through Amazon API Gateway and AWS Lambda.

Issue data is stored in Amazon DynamoDB.

The deployed architecture allows us to test the complete flow outside our local development environment.

---

## Testing

We tested the main application flow by:

1. Submitting an issue from the Student page.
2. Sending the request through API Gateway.
3. Processing the request with Lambda.
4. Storing the issue in DynamoDB.
5. Retrieving the issue in the Admin dashboard.
6. Updating the issue status through the backend API.

We also debugged browser-to-API communication and AWS IAM permissions during development.

---

## AI Tools Used

We used **ChatGPT** as an AI coding assistant during development for code
guidance, debugging, understanding AWS services and configuration, and
improving parts of the implementation.

The team reviewed, tested, modified, and integrated the suggestions while
building and deploying CampusCare.

---

## What We Learned

Building CampusCare helped us understand how multiple cloud services work together to create a working application.

We learned about:

* Hosting a frontend using Amazon S3
* Creating API endpoints with Amazon API Gateway
* Running backend logic using AWS Lambda
* Storing application data in Amazon DynamoDB
* Managing service permissions using AWS IAM
* Configuring CORS for browser-to-API communication
* Debugging issues across multiple cloud services
* Connecting a local frontend prototype to a deployed cloud backend

The biggest learning was understanding that cloud development is not only about writing application code. Configuration, permissions, APIs and communication between services are also important parts of building a working system.

---

## Future Improvements

The current version focuses on the core issue reporting and tracking workflow.

Possible future improvements include:

* Student authentication
* Image uploads with issue reports
* Better notification support
* Automatic issue categorization
* Duplicate or recurring issue detection
* Priority detection for urgent campus problems
* AI-assisted analysis of submitted reports

These are planned improvements and are not part of the current implementation.

---

## Team

**Team:** CloudPulse

**Project:** CampusCare

**Track:** Ship It

---

## Repository

GitHub:
https://github.com/Chandrika-Ganiger/CampusCare

---

## Project Summary

CampusCare started as a simple frontend prototype and was connected to AWS to create a working cloud-based application.

The final architecture uses:

**Amazon S3 → API Gateway → AWS Lambda → Amazon DynamoDB**

with **AWS IAM** managing the required permissions.

Our goal was not to build a large system, but to take a real campus problem, build a working solution and learn how AWS services can be connected to deploy it.
