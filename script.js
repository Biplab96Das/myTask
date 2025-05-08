angular.module('taskApp', [])
.controller('TaskController', function($scope) {
  $scope.task = { title: '', description: '', due_date: '', priority: '', completed: false };
  $scope.taskList = JSON.parse(localStorage.getItem('taskList')) || [];
  $scope.isDarkMode = JSON.parse(localStorage.getItem('isDarkMode')) || false;
  $scope.today = new Date().toISOString().split('T')[0];
  $scope.yesterday = new Date();
  $scope.yesterday.setDate($scope.yesterday.getDate() - 1);
  $scope.yesterday = $scope.yesterday.toISOString().split('T')[0]; // format as YYYY-MM-DD

  $scope.editingTaskIndex = -1;
  $scope.filterStatus = 'All';
  $scope.searchTerm = '';

  $scope.submitTask = function() {
    if (!$scope.task.title || !$scope.task.due_date || !$scope.task.priority) {
      alert("Please fill all required fields.");
      return;
    }

    if ($scope.editingTaskIndex > -1) {
      $scope.taskList[$scope.editingTaskIndex] = { ...$scope.task };
      $scope.editingTaskIndex = -1;
    } else {
      $scope.taskList.push({ ...$scope.task, completed: false });
    }

    localStorage.setItem('taskList', JSON.stringify($scope.taskList));
    $scope.task = { title: '', description: '', due_date: '', priority: '', completed: false };
  };

  $scope.editTask = function(task) {
    $scope.task = {
      ...task,
      due_date: $scope.formatToInputDate(task.due_date)
    };
    $scope.editingTaskIndex = $scope.taskList.indexOf(task);
  };

  $scope.deleteTask = function(task) {
    if (confirm(`Delete "${task.title}"?`)) {
      const index = $scope.taskList.indexOf(task);
      if (index !== -1) {
        $scope.taskList.splice(index, 1);
        localStorage.setItem('taskList', JSON.stringify($scope.taskList));
      }
    }
  };

  $scope.toggleCompleted = function(task) {
    task.completed = !task.completed;
    localStorage.setItem('taskList', JSON.stringify($scope.taskList));
  };

  $scope.toggleMode = function() {
    $scope.isDarkMode = !$scope.isDarkMode;
    localStorage.setItem('isDarkMode', JSON.stringify($scope.isDarkMode));
  };

  $scope.formatToInputDate = function(dateStr) {
    if (!dateStr) return '';
    var d = new Date(dateStr);
    var year = d.getFullYear();
    var month = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  $scope.getFilteredTasks = function() {
    return $scope.taskList.filter(function(task) {
      const statusMatch =
        $scope.filterStatus === 'All' ||
        ($scope.filterStatus === 'Completed' && task.completed) ||
        ($scope.filterStatus === 'Pending' && !task.completed);
      const dateMatch = !$scope.searchTerm || $scope.formatToInputDate(task.due_date) === $scope.searchTerm;
      return statusMatch && dateMatch;
    });
  };

  $scope.getFilteredCompletedCount = function () {
    const filtered = $scope.getFilteredTasks();
    return filtered.filter(task => task.completed).length;
  };

  $scope.getFilteredPendingCount = function () {
    const filtered = $scope.getFilteredTasks();
    return filtered.filter(task => !task.completed).length;
  };

  $scope.formatDate = function(dateStr) {
    if (!dateStr) return '';
    var d = new Date(dateStr);
    var day = String(d.getDate()).padStart(2, '0');
    var month = String(d.getMonth() + 1).padStart(2, '0');
    var year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  $scope.isDeadlineOver = function(task) {
    const today = new Date();
    const dueDate = new Date(task.due_date);
    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return dueDate < today && !task.completed;
  };
});