"use client";

import { useEffect, useState } from "react";
import { Space, Button, message } from "antd";
import axiosInstance from "@/app/components/axiosInstance/axiosInstance";
import TableComp from "@/app/components/Tables/TableComp";
import TaskModal from "./TaskModal"; // Reusable modal for Create/Edit
import { useRouter } from "next/navigation";

export default function UserDashPage() {
  const [tasks, setTasks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  const fetchTasks = async () => {
    try {
      const res = await axiosInstance.get("/api/get-task-list");
      if (res.status === 200) {
        const apiData = res.data.data;
        const formatted = apiData.map((item) => ({
          key: item._id,
          _id: item._id,
          title: item.title,
          description: item.description,
          dueDate: item.dueDate,
          completed: item.completed ? "Completed" : "Not Completed",
        }));
        setTasks(formatted);
      }
    } catch (e) {
      console.error("Error fetching tasks:", e);
      messageApi.open({
        type: "error",
        content: "Something went wrong!",
      });
    }
  };

  const handleCreate = () => {
    setSelectedTask(null);
    setModalOpen(true);
  };

  const handleEdit = (task) => {
    console.log("tsk---->", task);
    setSelectedTask({ ...task, completed: task.completed === "Completed" });
    setModalOpen(true);
  };

  const handleDelete = async (task) => {
    try {
      await axiosInstance.delete(`/api/delete-task/${task._id}`);
      messageApi.open({
        type: "success",
        content: "Task deleted successfully",
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
      messageApi.open({
        type: "error",
        content: "Something went wrong!",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.get(`/api/logout`);
      messageApi.open({
        type: "success",
        content: "User Logged Out",
      });
      router.push("/login");
    } catch (err) {
      console.error(err);
      messageApi.open({
        type: "error",
        content: "Something went wrong!",
      });
    }
  };

  const handleClearcache = async () => {
    try {
      await axiosInstance.get(`/api/clear-cache`);
      messageApi.open({
        type: "success",
        content: "cache cleared",
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
      messageApi.open({
        type: "error",
        content: "Something went wrong!",
      });
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const columns = [
    {
      title: "Task Name",
      dataIndex: "title",
      key: "title",
      width: 150,
      fixed: "left",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 200,
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      width: 120,
      sorter: true,
    },
    {
      title: "Status",
      dataIndex: "completed",
      key: "completed",
      width: 120,
      sorter: true,
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "left",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}

      <div className="flex justify-end items-center mb-4 mr-4 space-x-4">
        <Button
          id="task-log-btn"
          color="danger"
          variant="outlined"
          onClick={handleClearcache}
        >
          Clear Cache
        </Button>

        <Button
          id="task-log-btn"
          color="danger"
          variant="outlined"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Task List</h1>

        <TaskModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          initialData={selectedTask}
          refreshTasks={fetchTasks}
          setInitialdata={setSelectedTask}
        />
      </div>

      <TableComp dataSource={tasks} columns={columns} />
    </>
  );
}
