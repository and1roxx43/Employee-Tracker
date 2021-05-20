# Employee Tracker


## Overview

Develop an application that non technical users can use to view and interact with information stored in a database via a command line.

## Instructions

Create a database schema containing three tables
- employee
- role
- department
___

* **department**:

    * **id** - INT PRIMARY KEY
    * **name** - VARCHAR(30) to hold department name

* **role**:

    * **id** - INT PRIMARY KEY
    * **title** - VARCHAR(30) to hold role title
    * **salary** - DECIMAL to hold role salary
    * **department_id** - INT to hold reference to department role belongs to
* **employee**:

    * **id** - INT PRIMARY KEY
    * **first_name** - VARCHAR(30) to hold employee first name
    * **last_name** - VARCHAR(30) to hold employee last name
    * **role_id** - INT to hold reference to role employee has
    * **manager_id** - INT to hold reference to another employee that manages the employee being Created. This field may be null if the employee has no manager

    ___

    ## Acceptance Criteria

    - A Manager should be able to view and manage the departments, roles, and employees in a company.
    - When viewing all employees
    - Then all employees should be displayed
    - When viewing department by employee
    - Then should display department by employee
    - When viewing employees by manager
    - Then should display employees by manager
    - When adding new employee
    - Then should able to add a new employee
    - When adding new role
    - Then should able to add a new role
    - When adding new department
    - Then should able to add a new department
    - When adding updating employee
    - Then should able to update a new employee by role and manager
    - When removing an employee
    - Then should able to delete the employee

    ___
    