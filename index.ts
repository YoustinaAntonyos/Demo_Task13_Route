(
    function () {
        let taskList: any[] = [];
        let idForm = 1;

        const taskModal = document.querySelector('#taskModal');
        const plusButton = document.querySelector('#plusButton');
        const cancelModal = document.querySelector('#cancelModal');
        const closeModal = document.querySelector('#closeModal');
        const addlModal = document.querySelector('#addlModal');

        const deleteTask = document.querySelector('#deleteTask');
        const updateTask = document.querySelector('#updateTask');

        const titleTask = document.querySelector('#titleTask') as HTMLInputElement;
        const taskForm = document.querySelector('#taskForm') as HTMLFormElement;
        const descriptionTask = document.querySelector('#descriptionTask') as HTMLTextAreaElement;
        const priorityTask = document.querySelector('#priorityTask') as HTMLSelectElement;
        const dueDateTask = document.querySelector('#dueDateTask') as HTMLInputElement;

        const rowData = document.querySelector('#rowData') as HTMLDivElement;



        plusButton?.addEventListener('click', function (e) {
            taskModal?.classList.remove('hidden');
        })
        cancelModal?.addEventListener('click', function (e) {
            taskModal?.classList.add('hidden');
            editingTaskId = null;
            clearForm();
        })
        closeModal?.addEventListener('click', function (e) {
            taskModal?.classList.add('hidden');
            editingTaskId = null;
            clearForm();
        })
        addlModal?.addEventListener('click', function (e) {
            if (editingTaskId === null) {
                addTask();
            } else {
                updateTasks();
            }
            taskModal?.classList.add('hidden');
        })
        // deleteTask?.addEventListener('click',function(e){
        //     deleteTaskFun()
        //     console.log('hello');

        // })

        displayTask();


        // [{"id":"task-1783158524581-19lqxr9","title":"task1","description":"khvjvb,k","status":"completed","priority":"low","dueDate":"2026-07-07","createdAt":"2026-07-04T09:48:44.581Z"}]
        // id   = taskForm
        // title   =  titleTask
        // description   =  descriptionTask
        // status   =  in-progress
        // priority  =  priorityTask
        // dueDate   =  dueDateTask
        // createdAt  = addlModal


        let editingTaskId: number | null = null;
        // let sessionTotal = 0;
        // let total = document.getElementById("total");




        // add task function 
        function addTask() {
            console.log("array before: ", taskList);

            let tasks = {
                id: idForm,
                title: titleTask?.value,
                description: descriptionTask?.value,
                status: 'to-do',
                priority: priorityTask?.value,
                dueDate: dueDateTask?.value,
                createAt: new Date().toISOString()

            }
            console.log("form values: ", tasks);


            taskList.push(tasks);
            console.log("array after: ", taskList);

            idForm++;

            localStorage.setItem("tasks", JSON.stringify(taskList));
            clearForm();
            displayTask();


            // // Increment session total and update UI
            // sessionTotal += 1;
            // localStorage.setItem("totalContacts", sessionTotal);
            // if (total) {
            //     total.textContent = sessionTotal;
            // }
            // console.log("Session total contacts added:", sessionTotal);
            // // }

        }


        function renderTaskGroup(tasks: any[], container: HTMLDivElement | null) {
            if (!container) {
                return;
            }

            if (tasks.length === 0) {
                container.innerHTML = `
                    <div class="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-500">
                        No tasks
                    </div>`;
                return;
            }

            const cards = tasks.map((task) => `
                <div class="sec bg-white p-5 border border-gray-200 rounded-lg mt-2">
                    <div class="topCard flex justify-between mb-1.5">
                        <div class="numTask opacity-30 text-xs font-bold">#${task.id}</div>
                        <div class="editNDelite flex opacity-40 text-xs">
                            <button type="button" class="updatetask update-task-btn" data-id="${task.id}">
                                <i class="fa-solid fa-pen me-3"></i>
                            </button>
                            <button type="button" class="deletetask delete-task-btn" data-id="${task.id}">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <h3 class="font-bold opacity-80 mb-2">${task.title}</h3>
                    <p class="text-sm opacity-60">${task.description}</p>

                    <div class="low py-1.5 px-3 bg-blue-100 w-fit rounded-2xl mt-3 mb-2.5">
                        <p class="text-xs text-blue-800 font-bold">${task.priority}</p>
                    </div>
                    <div class="date flex">
                        <i class="fa-regular fa-calendar text-red-500 text-xs mt-0.5"></i>
                        <p class="text-xs text-red-500 ms-1.5">${task.dueDate}</p>
                    </div>
                    <hr class="my-3 text-gray-100">

                    <div class="btn-select flex">
                        <div class="btn text-xs text-amber-800 bg-amber-400/25 w-fit flex py-2 px-3 rounded-xl me-2">
                            <i class="fa-solid fa-play mt-0.5"></i>
                            <p class="ms-1.5 font-bold state-task-btn" data-state="start" data-id="${task.id}">Start</p>
                        </div>
                        <div class="btn text-xs text-green-800 bg-green-400/25 w-fit flex py-2 px-3 rounded-xl me-2">
                            <i class="fa-solid fa-check mt-0.5"></i>
                            <p class="ms-1.5 font-bold state-task-btn" data-state="complete" data-id="${task.id}">Complete</p>
                        </div>
                        <div class="btn text-xs text-gray-800 bg-gray-400/25 w-fit flex py-2 px-3 rounded-xl me-2">
                            <i class="fa-solid fa-rotate-left mt-0.5"></i>
                            <p class="ms-1.5 font-bold state-task-btn" data-state="to-do" data-id="${task.id}">To Do</p>
                        </div>
                    </div>
                </div>
            `).join('');

            container.innerHTML = cards;

            const deleteButtons = container.querySelectorAll('.delete-task-btn');
            deleteButtons.forEach((button) => {
                button.addEventListener('click', (event) => {
                    const currentButton = event.currentTarget as HTMLButtonElement;
                    const taskId = Number(currentButton.dataset.id);
                    deleteTaskFun(taskId);
                });
            });

            const stateTaskButtons = container.querySelectorAll('.state-task-btn');
            stateTaskButtons.forEach((button) => {
                button.addEventListener('click', (event) => {
                    const currentButton = event.currentTarget as HTMLButtonElement;
                    const state = currentButton.dataset.state;
                    const id = Number(currentButton.dataset.id);
                    changeStateFun(state, id);
                });
            });

            const updateButtons = container.querySelectorAll('.update-task-btn');
            updateButtons.forEach((button) => {
                button.addEventListener('click', (event) => {
                    const currentButton = event.currentTarget as HTMLButtonElement;
                    const taskId = Number(currentButton.dataset.id);
                    updateTaskFun(taskId);
                });
            });
        }

        function displayTask() {
            const storedTasks = localStorage.getItem("tasks");
            taskList = storedTasks ? JSON.parse(storedTasks) : [];

            const todoTasks = taskList.filter((task) => (task.status ?? 'to-do') === 'to-do' || (task.status ?? 'to-do') === 'todo' || (task.status ?? 'to-do') === 'to do');
            const progressTasks = taskList.filter((task) => (task.status ?? 'to-do') === 'start' || (task.status ?? 'to-do') === 'in-progress' || (task.status ?? 'to-do') === 'in progress' || (task.status ?? 'to-do') === 'progress');
            const completedTasks = taskList.filter((task) => (task.status ?? 'to-do') === 'complete' || (task.status ?? 'to-do') === 'completed');

            renderTaskGroup(todoTasks, document.querySelector('#todoColumn') as HTMLDivElement | null);
            renderTaskGroup(progressTasks, document.querySelector('#inProgressColumn') as HTMLDivElement | null);
            renderTaskGroup(completedTasks, document.querySelector('#completedColumn') as HTMLDivElement | null);
        }


        function clearForm() {
            taskForm.reset();
            titleTask.value = '';
            descriptionTask.value = '';
            priorityTask.value = '';
            dueDateTask.value = '';

        }


        // delete task function 
        function deleteTaskFun(taskId: number) {
            const taskIndex = taskList.findIndex((task) => task.id === taskId);

            if (taskIndex !== -1) {
                taskList.splice(taskIndex, 1);
                localStorage.setItem("tasks", JSON.stringify(taskList));
                displayTask();
            }
        }

        function changeStateFun(state: any, id: number){
            const taskIndex = taskList.findIndex((task) => task.id === id);

            const taskObj = taskList.find((task) => task.id === id);

            if (taskObj) {
                // taskList.splice(taskIndex, 1);
                console.log("object edit state: ", taskObj);
                console.log("state select: ", state);
                taskObj.status = state;

                taskList[taskIndex].status = state;

                localStorage.setItem("tasks", JSON.stringify(taskList));
                displayTask();
            }
        }



        // update task function
        function updateTaskFun(taskId: number) {
            const taskToEdit = taskList.find((task) => task.id === taskId);

            if (!taskToEdit) {
                return;
            }

            editingTaskId = taskId;
            titleTask.value = taskToEdit.title;
            descriptionTask.value = taskToEdit.description;
            priorityTask.value = taskToEdit.priority;
            dueDateTask.value = taskToEdit.dueDate;
            taskModal?.classList.remove('hidden');
        }

        function updateTasks() {
            if (editingTaskId === null) {
                return;
            }

            const taskIndex = taskList.findIndex((task) => task.id === editingTaskId);

            if (taskIndex === -1) {
                return;
            }

            taskList[taskIndex].title = titleTask.value;
            taskList[taskIndex].description = descriptionTask.value;
            taskList[taskIndex].priority = priorityTask.value;
            taskList[taskIndex].dueDate = dueDateTask.value;

            localStorage.setItem("tasks", JSON.stringify(taskList));
            displayTask();
            clearForm();
            editingTaskId = null;
        }


    }
)() 