import React, { useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './Pipeline.css'; // Подключаем новый CSS-файл

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Build', startTime: null, endTime: null },
    position: { x: 250, y: 0 },
    status: 'Pending',
  },
  {
    id: '2',
    data: { label: 'Test', startTime: null, endTime: null },
    position: { x: 100, y: 150 },
    status: 'Pending',
  },
  {
    id: '3',
    data: { label: 'Deploy', startTime: null, endTime: null },
    position: { x: 400, y: 150 },
    status: 'Pending',
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3', animated: true },
];

const statusColors = {
  Pending: '#ffcc80', // Светло-оранжевый
  Running: '#80deea', // Голубой
  Completed: '#a5d6a7', // Светло-зеленый
  Failed: '#ef9a9a', // Светло-красный
};

const Pipeline = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [logs, setLogs] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [taskDetails, setTaskDetails] = useState(null);

  const updateNodeStatus = (nodeId, status) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          const currentTime = new Date().toLocaleTimeString();
          return {
            ...node,
            status,
            style: { background: statusColors[status], color: '#000' },
            data: {
              ...node.data,
              startTime: status === 'Running' ? currentTime : node.data.startTime,
              endTime: status === 'Completed' ? currentTime : node.data.endTime,
            },
          };
        }
        return node;
      })
    );
    setLogs((prevLogs) => [...prevLogs, `Task ${nodeId} status updated to ${status}`]);
  };

  const runPipeline = () => {
    let delay = 0;
    nodes.forEach((node) => {
      setTimeout(() => updateNodeStatus(node.id, 'Running'), delay);
      delay += 2000;
      setTimeout(() => updateNodeStatus(node.id, 'Completed'), delay);
      delay += 2000;
    });
  };

  const stopPipeline = () => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        status: 'Failed',
        style: { background: statusColors['Failed'], color: '#000' },
      }))
    );
    setLogs((prevLogs) => [...prevLogs, 'Pipeline stopped manually']);
  };

  const restartPipeline = () => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        status: 'Pending',
        style: { background: statusColors['Pending'], color: '#000' },
        data: { ...node.data, startTime: null, endTime: null },
      }))
    );
    runPipeline();
  };

  const addNode = (label) => {
    if (!label) return;
    const newNodeId = (nodes.length + 1).toString();
    const newNode = {
      id: newNodeId,
      data: { label, startTime: null, endTime: null },
      position: { x: Math.random() * 600, y: Math.random() * 400 },
      status: 'Pending',
      style: { background: statusColors['Pending'], color: '#000' },
    };
    const lastNodeId = nodes[nodes.length - 1].id;
    const newEdge = {
      id: `e${lastNodeId}-${newNodeId}`,
      source: lastNodeId,
      target: newNodeId,
      animated: true,
    };
    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, newEdge]);
    setLogs((prevLogs) => [...prevLogs, `Added new task: ${label}`]);
    setNewTaskName('');
  };

  const onNodeClick = (event, node) => {
    setTaskDetails(node);
  };

  return (
    <div className="pipeline-container">
      <h2 className="pipeline-header">CI/CD Pipeline Dashboard</h2>
      <div className="pipeline-layout">
        {/* Левая колонка: Управление и логи */}
        <div className="pipeline-controls">
          <div className="pipeline-actions">
            <button className="pipeline-button" onClick={runPipeline}>Run Pipeline</button>
            <button className="pipeline-button" onClick={stopPipeline}>Stop Pipeline</button>
            <button className="pipeline-button" onClick={restartPipeline}>Restart Pipeline</button>
          </div>
          <div className="pipeline-add-task">
            <input
              type="text"
              placeholder="Enter Task Name"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              className="pipeline-input"
            />
            <button className="pipeline-button" onClick={() => addNode(newTaskName)}>
              Add Task
            </button>
          </div>
          <div className="pipeline-task-logs">
            <h4>Pipeline Logs</h4>
            <div className="logs-container">
              {logs.map((log, index) => (
                <p key={index} className="log-entry">{log}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Правая колонка: Граф и детали задачи */}
        <div className="pipeline-graph">
          <div className="reactflow-container">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              fitView
            >
              <MiniMap />
              <Controls />
              <Background color="#aaa" gap={16} />
            </ReactFlow>
          </div>
          {taskDetails && (
            <div className="pipeline-task-details">
              <h4>Task Details</h4>
              <p><strong>Name:</strong> {taskDetails.data.label}</p>
              <p><strong>Status:</strong> {taskDetails.status}</p>
              <p><strong>Start Time:</strong> {taskDetails.data.startTime || 'N/A'}</p>
              <p><strong>End Time:</strong> {taskDetails.data.endTime || 'N/A'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pipeline;