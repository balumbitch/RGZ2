import React from 'react';

const Graph = ({ tasks }) => {
    return (
        <div>
            {tasks.map(task => (
                <div key={task.id} style={{ color: task.status === 'Completed' ? 'green' : 'red' }}>
                    {task.name}
                </div>
            ))}
        </div>
    );
};

export default Graph;
