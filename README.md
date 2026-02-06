# Doctor Appointment Scheduling System

This repository contains the backend internship task for a **Doctor Appointment Scheduling System**.

## ER Diagram
The ER diagram represents the core data model of the system and includes the following entities:
- User
- Doctor
- Patient
- Availability
- Appointment
- Payment

The design follows proper normalization and clearly defines relationships between doctors, patients, availability slots, and appointments.

## Backend – Hello World API (NestJS + TypeScript)
A simple backend application is implemented using **NestJS and TypeScript** to verify API setup and routing.

### How to run
cd backend-nest/hello-nest-api
npm install
npm run start


Endpoint

GET / → Returns a Hello World response

## PostgreSQL Database Connection

The backend is connected to a PostgreSQL database using TypeORM.

Database Engine: PostgreSQL

Database Name: doctor_appointment_db

ORM: TypeORM

Entity synchronization enabled for development

The application successfully connects to PostgreSQL and creates database tables on startup.
