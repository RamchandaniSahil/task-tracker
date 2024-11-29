#!/usr/bin/env node

import * as fs from "fs";

function collectTaskData(id, task, status, updatedDate = "") {
    /**
     * Collect Data for task and return object of that task.
     * Input Parameters:
     *      id - Task Unique Id,
     *      task - Task Description,
     *      status - Task Status,
     *      updatedDate - Date when task is updated,
     */
    let data = {
        id: id,
        task: task,
        status: status,
        createdAt: new Date().toLocaleString(),
        updatedAt: updatedDate,
    };
    return data;
}

function getFileData() {
    let fileData = fs.readFileSync("task.json");
    // Check whether file contains some data or it's absolute empty file
    if (fileData.length > 0) {
        // Collect previous data
        let returnData = JSON.parse(fileData);
        return returnData;
    }
    return;
}

function addTask(task) {
    /**
     * Add task in file if file is not created then created and add new task and console with success message and id
     */
    fs.exists("task.json", function (exists) {
        let data;
        let id = 1;
        if (exists) {
            let fileData = getFileData();
            if (fileData) {
                // Collect last index from previous data
                let previousId = fileData[fileData.length - 1].id;
                // Collect new data
                id = previousId + 1;
                let taskData = collectTaskData(id, task[0], "todo");
                // Push new data in previous data and assign in latest data
                fileData.push(taskData);
                data = fileData;
            } else {
                // Add new data for empty file
                data = [collectTaskData(id, task[0], "todo")];
            }
        } else {
            // Add new data for empty file
            data = [collectTaskData(id, task[0], "todo")];
        }
        // Add data in task.json file
        fs.writeFileSync("./task.json", JSON.stringify(data));
        console.info(`Task added successfully (ID: ${id})`);
    });
}

function updateTask(taskId, taskDescription) {
    /**
     * Update task description of given id
     */
    fs.exists("task.json", function (exists) {
        if (!exists) {
            return console.warn(
                "You don't have any task to update first create tasks to update"
            );
        }
        let fileData = getFileData();
        if (!fileData) {
            return console.warn(
                "You don't have any task to update first create tasks to update"
            );
        }
        for (let i = 0; i < fileData.length; i++) {
            if (fileData[i].id == Number(taskId)) {
                fileData[i].task = taskDescription;
                fileData[i].updatedAt = new Date().toLocaleString();
                break;
            }
        }
        fs.writeFileSync("./task.json", JSON.stringify(fileData));
        console.info("Task update successfully");
    });
}

function deleteTask(taskId) {
    /**
     * Delete task of given id
     */
    fs.exists("task.json", function (exists) {
        if (!exists) {
            return console.warn("You don't have any task to delete");
        }
        let fileData = getFileData();
        if (!fileData) {
            return console.warn("You don't have any task to delete");
        }
        let isTaskPresent = false;
        for (let i = 0; i < fileData.length; i++) {
            if (fileData[i].id == Number(taskId)) {
                isTaskPresent = true;
                fileData.splice(i, 1);
                break;
            }
        }
        if (!isTaskPresent) {
            return console.warn(
                `Id ${taskId} is not present in your task (To see more about your task id run 'node index.js list')`
            );
        }
        fs.writeFileSync("./task.json", JSON.stringify(fileData));
        console.info("Task deleted successfully");
    });
}

function markInProgress(taskId) {
    /**
     * Change status into mark-in-progress
     */
    fs.exists("task.json", function (exists) {
        if (!exists) {
            return console.warn(
                "You don't have any task to make-in-progress! To make task in progress first create task"
            );
        }
        let fileData = getFileData();
        if (!fileData) {
            return console.warn(
                "You don't have any task to make-in-progress! To make task in progress first create task"
            );
        }
        let isTaskAlreadyDone,
            isTaskAlreadyInProgress,
            isTaskIdAvailable = false;
        for (let i = 0; i < fileData.length; i++) {
            if (fileData[i].id == Number(taskId)) {
                isTaskIdAvailable = true;
                if (fileData[i].status === "todo") {
                    fileData[i].status = "in-progress";
                } else if (fileData[i].status === "in-progress") {
                    isTaskAlreadyInProgress = true;
                } else {
                    isTaskAlreadyDone = true;
                }
                break;
            }
        }
        if (!isTaskIdAvailable) {
            return console.warn(
                `Task Id ${taskId} is not present in your file.`
            );
        }
        if (isTaskAlreadyInProgress) {
            return console.warn(`Task ${taskId} is already is in-progress.`);
        } else if (isTaskAlreadyDone) {
            return console.warn(`Task ${taskId} is already done.`);
        }
        fs.writeFileSync("./task.json", JSON.stringify(fileData));
        console.info("Your Task mark as in progress");
    });
}

function markDone(taskId) {
    /**
     * Change status into mark-done
     */
    fs.exists("task.json", function (exists) {
        if (!exists) {
            return console.warn(
                "You don't have any task to make-done! To make task done first create task"
            );
        }
        let fileData = getFileData();
        if (!fileData) {
            return console.warn(
                "You don't have any task to make-done! To make task done first create task"
            );
        }
        let isTaskAlreadyDone,
            isTaskIdAvailable = false;
        for (let i = 0; i < fileData.length; i++) {
            if (fileData[i].id == Number(taskId)) {
                isTaskIdAvailable = true;
                if (
                    fileData[i].status === "todo" ||
                    fileData[i].status === "in-progress"
                ) {
                    fileData[i].status = "done";
                } else {
                    isTaskAlreadyDone = true;
                }
                break;
            }
        }
        if (!isTaskIdAvailable) {
            return console.warn(
                `Task Id ${taskId} is not present in your file.`
            );
        }
        if (isTaskAlreadyDone) {
            return console.warn(`Task ${taskId} is already done.`);
        }
        fs.writeFileSync("./task.json", JSON.stringify(fileData));
        console.info("Your Task mark as in done");
    });
}

function listAllTask() {
    /**
     * For list all tasks
     */
    fs.exists("task.json", function (exists) {
        if (!exists) {
            return console.warn(
                "You don't have task to list for list all task first create task by run `node index.js add 'Your Task Here'`"
            );
        }
        let fileData = getFileData();
        if (!fileData) {
            return console.warn(
                "You don't have task to list for list all task first create task by run `node index.js add 'Your Task Here'`"
            );
        }
        for (let i = 0; i < fileData.length; i++) {
            let text = `
            Task Details:- \n ID: ${fileData[i].id}\n Title: ${fileData[i].task} \n Status: ${fileData[i].status} \n Create Date: ${fileData[i].createdAt}
            `;
            if (fileData[i].updatedAt) {
                text = text + "Update Date: " + fileData[i].updatedAt;
            }
            console.info(text);
        }
    });
}

function listTaskAccordingStatus(condition) {
    /**
     * List Task According status
     */
    fs.exists("task.json", function (exists) {
        if (!exists) {
            return console.warn(
                "You don't have task to list for list all task first create task by run `node index.js add 'Your Task Here'`"
            );
        }
        let fileData = getFileData();
        if (!fileData) {
            return console.warn(
                "You don't have task to list for list all task first create task by run `node index.js add 'Your Task Here'`"
            );
        }
        for (let i = 0; i < fileData.length; i++) {
            if (fileData[i].status === condition) {
                let text = `
                Task Details:- \n ID: ${fileData[i].id}\n Title: ${fileData[i].task} \n Status: ${fileData[i].status} \n Create Date: ${fileData[i].createdAt}
                `;
                if (fileData[i].updatedAt) {
                    text = text + "\n" + fileData[i].updatedAt;
                }
                console.info(text);
            }
        }
    });
}

function cliLogic() {
    let argument = process.argv.slice(2);
    // Command Line Interface (CLI) Logic
    if (argument && argument[0]) {
        if (argument[0].toLowerCase() == "add") {
            let task = argument.slice(1); // Extract task from argument
            if (task.length > 0) {
                addTask(task);
            } else {
                console.warn(
                    "You haven't added task, You can add task like: `node index.js add 'Your Task Here'`"
                );
            }
        } else if (argument[0].toLowerCase() == "update") {
            if (argument.length >= 1) {
                let taskId = Number(argument[1]);
                if (isNaN(taskId)) {
                    return console.warn("Task id must be in number");
                }
                let taskDescription = argument[2];
                if (taskDescription) {
                    updateTask(taskId, taskDescription);
                } else {
                    return console.warn(
                        "Please add some task description to update (If you don't remember id of task then run `node index.js list`)"
                    );
                }
            }
        } else if (argument[0].toLowerCase() == "delete") {
            if (argument.length >= 1) {
                let taskId = Number(argument[1]);
                if (isNaN(taskId)) {
                    return console.warn("Task id must be in number");
                }
                deleteTask(taskId);
            } else {
                console.warn(
                    "Please add task id to delete any task (If you don't remember id of task then run `node index.js list`)"
                );
            }
        } else if (argument[0].toLowerCase() == "mark-in-progress") {
            if (argument.length >= 1) {
                let taskId = Number(argument[1]);
                if (isNaN(taskId)) {
                    return console.warn("Task id must be in number");
                }
                markInProgress(taskId);
            } else {
                console.warn(
                    "Please add task id to make your task in progress (If you don't remember id of task then run `node index.js list`)"
                );
            }
        } else if (argument[0].toLowerCase() == "mark-done") {
            if (argument.length >= 1) {
                let taskId = Number(argument[1]);
                if (isNaN(taskId)) {
                    return console.warn("Task id must be in number");
                }
                markDone(taskId);
            } else {
                console.warn(
                    "Please add task id to make your task in done (If you don't remember id of task then run `node index.js list`)"
                );
            }
        } else if (argument[0].toLowerCase() == "list") {
            if (argument.length > 0) {
                if (argument.length > 1) {
                    if (
                        !["done", "todo", "in-progress"].includes(argument[1])
                    ) {
                        console.warn(
                            `Status must be one of the following: 'done,' 'todo,' or 'in-progress.' Please update your input.`
                        );
                    }
                    listTaskAccordingStatus(argument[1]);
                } else {
                    listAllTask();
                }
            } else {
                console.warn(
                    "You don't have task to list for list all task first create task by run `node index.js add 'Your Task Here'`)"
                );
            }
        }
    }
}
cliLogic();
