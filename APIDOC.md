# TODO API Documentation
The TODO API provides information to add, remove, and retrieve tasks in the Todo list.

## Retrieve all tasks in the todo list
**Request Format:** /getTasks

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Returns an array of task objects that the user has added.


**Example Request:** /getTasks

**Example Response:**

```json
[
  {
    "id":"703",
    "description":"This is a task"
  },
  {
    "id":"512",
    "description":"This is another task"
  }
]
```

**Error Handling:**
- N/A

## Add a task in the todo list
**Request Format:** /addTask with the `id` and `description` as FormData in the request body

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** Adds a task in the todo list with the given id and description.

**Example Request:** /addTask with `id=123123123` and `description="this is a task!"` as FormData in the request body.

**Example Response:**
`Task was Added!`

**Error Handling:**
- Possible 500 internal server error (all plain text):
  - An error is returned with the message: `Something went wrong...`


## Remove a task from the todo list
**Request Format:** /removeTask with the POST parameter of `id` in the request body

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** Removes the task from the todo list with the given id.

**Example Request:** /removeTask with POST parameter of `id=123123123` in the request body.

**Example Response:**
`Task was removed!`

**Error Handling:**
- Possible 400 (invalid request) error (all plain text):
  - If missing the id, an error is returned with the message: `Please provide an id!`
- Possible 500 internal server error (all plain text):
  - An error is returned with the message: `Something went wrong...`
