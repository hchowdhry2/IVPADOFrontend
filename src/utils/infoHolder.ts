const infoHolder = {
  "visualizationLogicRegistry": {
    "spillage": {
        "title": "Spillage Trend",
        "description": "Identifies work added after sprint planning, indicating scope changes or unforeseen work.",
        "formula": "Spillage = Total Assigned Points - Total Closed Points",
        "rules": [
        "Includes all User Stories/Tasks within the selected sprint range.",
        "Excludes items where Parent type is null.",
        "Calculated based on snapshot of assigned vs. closed points."
        ]
    },
    "stats": {
        "title": "Sprint Stats",
        "description": "Breaks down planned vs. actual work and completion timing.",
        "formula": "Calculates Initial vs Added based on AssignmentDate relative to SprintStart.",
        "rules": [
        "Items must match the Sprint iteration path.",
        "Items must be within the defined AreaPath configuration.",
        "Excludes items where AssignedDate is outside sprint end dates."
        ]
    },
    "dailyScope": {
        "title": "Daily Scope Evolution",
        "description": "Visualizes how the scope of the sprint evolved day by day, showing when work was added or removed.",
        "formula": "DailyTotal += Value for all items where AssignedDate <= snapshotTime",
        "rules": [
        "Cumulative snapshot of points per day.",
        "Increasing trend indicates increased sprint scope.",
        "Excludes items where AssignedDate is after the current snapshot day."
        ]
    },
    "impactGrid": {
        "title": "Impacted Parent History",
        "description": "Identifies features with significant planning churn or shifting priorities.",
        "formula": "Churn Score = Count of Iteration Path changes",
        "rules": [
        "Includes work items involved in all iterations.",
        "Excludes top-level items without Parents.",
        "Excludes items without iteration history."
        ]
    },
    "devWorkload": {
        "title": "Developer Workload",
        "description": "Determines the 'True Owner' based on task duration.",
        "formula": "Attributed to the developer holding the task for ≥ 24 hours.",
        "rules": [
        "Strictly Tasks only (isTask=true).",
        "Requires assignments > 24 hours to filter out transient/accidental changes.",
        "Excludes User Stories and assignments < 24 hours."
        ]
    },
    "sprintProgressDev": {
        "title": "Developer Sprint Progress",
        "description": "Shows individual developer contributions and workload completion across sprints.",
        "formula": "Sum of TotalTasksAssigned and TotalTasksCompleted per developer.",
        "rules": [
        "Strictly Tasks only.",
        "Filtered by sprint iteration path.",
        "Excludes User Stories and unassigned tasks."
        ]
    },
    "effortVariance": {
        "title": "Effort Variance",
        "description": "Compares committed effort against actual expended hours.",
        "formula": "Actual = Σ(DevEffort * 7) | Committed = Σ(InitialEffort)",
        "rules": [
        "Calculated exclusively for 'Closed' tasks.",
        "Excludes Open/Active tasks and User Stories.",
        "Tasks with NULL effort are treated as 0."
        ]
    }
}
};

export default infoHolder;