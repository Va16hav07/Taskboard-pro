/**
 * Verify if a user is authorized to modify a task
 * @param {Object} task - The task document
 * @param {Object} project - The project document
 * @param {String} uid - The user's ID
 * @returns {Boolean} - Whether the user is authorized
 */
export const isAuthorizedForTask = (task, project, uid) => {
  // Check if user is project owner
  const isProjectOwner = project.members.some(
    member => member.userId === uid && member.role === 'owner'
  );
  
  // Check if user is the task assignee
  const isTaskAssignee = task.assignee && task.assignee.userId === uid;
  
  console.log({
    taskAssigneeId: task.assignee?.userId,
    currentUserId: uid,
    isTaskAssignee,
    isProjectOwner
  });
  
  return isProjectOwner || isTaskAssignee;
};
