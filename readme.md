# Task Tracker

Sample solution for the [task-tracker](https://roadmap.sh/projects/task-tracker) challenge from [roadmap.sh](https://roadmap.sh/).

### How to run

Clone the Repository

```
git clone https://github.com/RamchandaniSahil/task-traker.git
cd task-tracker
```

Run the following command to run the project

```
# Adding a new task
task-cli add "Buy groceries"

# Updating tasks
task-cli update 1 "Buy groceries and cook dinner"

# Deleting tasks
task-cli delete 1

# Marking a task as in progress
task-cli mark-in-progress 1

#Marking a task as done
task-cli mark-done 1

# Listing all tasks
task-cli list

# Listing tasks by status
task-cli list done
task-cli list todo
task-cli list in-progress
```
