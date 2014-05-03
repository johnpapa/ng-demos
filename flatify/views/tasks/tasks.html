<div class="page page-tasks">
    <div class="row">
        <div class="col-md-12">
            <section class="task-container" data-ng-controller="taskCtrl">

                <form data-ng-submit="add()" class="add-task">
                    <input type="text"
                           placeholder="What needs to be done?"
                           class="form-control"
                           data-ng-model="newTask"
                           autofocus>
                    <a type="submit" class="submit-button" data-ng-click="add()">
                        <span class="glyphicon glyphicon-plus"></span>
                    </a>
                </form>

                <section>
                    <ul class="filters list-inline nav nav-tabs">
                        <li data-ng-class="{active: statusFilter == ''}">
                            <a href="" 
                               data-toggle="tab"
                               data-ng-click="filter('all')"
                               >All</a>
                        </li>
                        <li data-ng-class="{active: statusFilter.completed == false }">
                            <a href=""
                               data-toggle="tab"
                               data-ng-click="filter('active')"
                               >Active</a>
                        </li>
                        <li data-ng-class="{active: statusFilter.completed == true }">
                            <a href=""
                               data-toggle="tab"
                               data-ng-click="filter('completed')"
                               >Completed</a>
                        </li>
                    </ul>
                </section>

                <section  data-ng-cloak>
                    <ul class="task-list list-unstyled">
                        <li data-ng-repeat="task in tasks | filter:statusFilter track by $index" 
                            data-ng-class="{completed: task.completed, editing: task == editedTask}">
                            <span class="view">
                                <input type="checkbox"
                                       class="toggle-task"
                                       data-ng-model="task.completed"
                                       data-ng-change="completed(task)">
                                <label data-ng-dblclick="edit(task)">{{task.title}}</label>
                                <span class="glyphicon glyphicon-pencil"
                                      data-ng-click="edit(task)"></span>
                                <span class="glyphicon glyphicon-remove"
                                      data-ng-click="remove(task, $index)"
                                      ></span>
                            </span>
                            <form data-ng-submit="doneEditing(task, $index)">
                                <input type="text"
                                       class="edit form-control"
                                       data-ng-trim="false"
                                       data-ng-model="task.title"
                                       data-ng-blur="doneEditing(task, $index)"
                                       data-task-focus="task == editedTask">
                            </form>
                        </li>
                    </ul>
                </section>

                <footer class="task-footer">
                    <ul class="list-inline clearfix">
                        <li class="first-item">
                            <input type="checkbox"
                                   id="toggle-all"
                                   data-ng-model="allChecked"
                                   data-ng-change="markAll(allChecked)">
                            <label for="toggle-all">Mark all as done</label>
                        </li>
                        <li class="text-center">
                            <span>
                                <strong>{{remainingCount}}</strong>
                                <span class="text-muted"
                                      data-ng-pluralize count="remainingCount"
                                      when="{one: 'item left', other: 'items left'}"></span>
                            </span>                            
                        </li>
                        <li class="text-right">
                            <span class="clear-completed"
                                  data-ng-click="clearCompleted()"
                                  data-ng-show="remainingCount < tasks.length">Clear completed ({{tasks.length - remainingCount}})</span>                            
                        </li>
                    </ul>
                </footer>
                
            </section>
        </div>
    </div>

    <div class="callout callout-info">
        <p>Tips:</p>
        <p> - Double click the task (or click the edit icon on the right of the task) to edit, then click anywhere else done editing.</p>
        <p> - Type a something needs to done, then press "return" key (or the plus icon on the left) to add a new task</p>
        <p> - Click the remove icon on the right of the task to remove</p>
    </div>
</div>