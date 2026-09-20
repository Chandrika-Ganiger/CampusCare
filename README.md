# CampusCare

CampusCare is a campus issue reporting and tracking platform built for students and campus administrators.

It provides a simple way for students to report common campus problems and allows administrators to view and update the status of those reports.

## Problem

Campus issues such as Wi-Fi problems, faulty fans, lights, smartboards and power/socket issues are often reported through informal messages or conversations. This can make it difficult to track whether an issue has been handled.

CampusCare provides a central place to report and track these issues.

## Features

### Student

* Submit a campus issue
* Enter student name and email
* Select the issue category
* Enter building and room details
* Add a description of the problem
* Track submitted issues

### Admin

* View reported issues
* View issue details
* Filter issues by status
* Update issue status
* Add a message for the student
* View total, pending, in-progress and cleared issues

## AWS Architecture

The project uses the following AWS services:

* **Amazon S3** – hosts the frontend pages
* **Amazon API Gateway** – provides the API endpoint
* **AWS Lambda** – handles backend logic
* **Amazon DynamoDB** – stores campus issue data
* **AWS IAM** – provides permissions for Lambda to access DynamoDB

### Flow

```text
Student / Admin
       |
       v
Amazon S3
       |
       v
API Gateway
       |
       v
AWS Lambda
       |
       v
DynamoDB
```

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

## Issue Status Flow

```text
Pending → In Progress → Cleared
```

A student submits an issue with the required details. The issue is stored in DynamoDB through the API Gateway and Lambda backend. The admin can then view the issue and update its status.

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

## Deployment

The frontend is deployed using Amazon S3.

The backend is connected through Amazon API Gateway and AWS Lambda, with issue data stored in Amazon DynamoDB.

## Team

**Team:** Cloudpulse

**Project:** CampusCare

## Future Improvements

Some possible future improvements include:

* Student authentication
* Image upload for issue reporting
* Better notification support
* Duplicate or recurring issue detection
* Automatic issue categorization
* Priority detection for urgent campus problems

## What We Learned

While building CampusCare, we learned how a frontend application can be connected to AWS services to create a working backend. We worked with S3, API Gateway, Lambda, DynamoDB and IAM, and learned about issues such as CORS configuration, API integration and permissions.

