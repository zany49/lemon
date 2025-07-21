import Task from '../models/Task.js';
import { createRedisClient } from '../redisClient/redisClient.js';
import dayjs from 'dayjs';

const TASK_LIST_TTL = 300;

const formatDate = (date) => (date ? dayjs(date).format('DD-MM-YYYY') : null);

async function clearUserCache(userId) {
  const redis = await createRedisClient();
  await redis.del(`tasks:${userId}`);
}

export const createTask = async (req, res) => {
  try {
    const userId = req.auth._id;
    const { title, description, dueDate } = req.body;
    const redis = await createRedisClient();
    console.log("dueDate--->",dueDate);
    
    const task = await Task.create({ userId, title, description, dueDate });

    const taskKey = `task:${userId}:${task._id}`;
    await redis.hSet(taskKey, [
      '_id', task._id.toString(),
      'title', task.title,
      'description', task.description || '',
      'completed', task.completed.toString(),
      'dueDate', task.dueDate ? task.dueDate.toISOString() : '',
    ]);
    await redis.expire(taskKey, TASK_LIST_TTL);

    await clearUserCache(userId);

    return res.status(201).json({
      data: {
        ...task.toObject(),
        dueDate: formatDate(task.dueDate),
      },
      message: 'Task Created',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const userId = req.auth._id;
    const tasks = await Task.find({ userId }).lean();
    const redis = await createRedisClient();

    for (const task of tasks) {
      const taskKey = `task:${userId}:${task._id}`;
      const exists = await redis.exists(taskKey);
      if (!exists) {
        await redis.hSet(taskKey, [
          '_id', task._id.toString(),
          'title', task.title,
          'description', task.description || '',
          'completed', task.completed.toString(),
          'dueDate', task.dueDate ? task.dueDate.toISOString() : '',
        ]);
        await redis.expire(taskKey, TASK_LIST_TTL);
      }
    }

    const formattedTasks = tasks.map((t) => ({
      ...t,
      dueDate: formatDate(t.dueDate),
    }));

    return res.status(200).json({
      data: formattedTasks,
      message: 'Task List',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const userId = req.auth._id;
    const { id } = req.params;
    const taskKey = `task:${userId}:${id}`;
    const redis = await createRedisClient();

    const cachedTask = await redis.hGetAll(taskKey);
    if (Object.keys(cachedTask).length) {
      return res.json({
        _id: id,
        title: cachedTask.title,
        description: cachedTask.description,
        completed: cachedTask.completed === 'true',
        dueDate: cachedTask.dueDate
          ? dayjs(cachedTask.dueDate).format('DD-MM-YYYY')
          : null,
      });
    }

    const task = await Task.findOne({ _id: id, userId }).lean();
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await redis.hSet(taskKey, [
      '_id', task._id.toString(),
      'title', task.title,
      'description', task.description || '',
      'completed', task.completed.toString(),
      'dueDate', task.dueDate ? task.dueDate.toISOString() : '',
    ]);
    await redis.expire(taskKey, TASK_LIST_TTL);

    return res.status(200).json({
      data: {
        ...task,
        dueDate: formatDate(task.dueDate),
      },
      message: 'Task By Id',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const userId = req.auth._id;
    const { id } = req.params;
    const redis = await createRedisClient();

    const task = await Task.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const taskKey = `task:${userId}:${id}`;
    await redis.hSet(taskKey, [
      '_id', task._id.toString(),
      'title', task.title,
      'description', task.description || '',
      'completed', task.completed.toString(),
      'dueDate', task.dueDate ? task.dueDate.toISOString() : '',
    ]);
    await redis.expire(taskKey, TASK_LIST_TTL);

    await clearUserCache(userId);

    return res.status(200).json({
      data: {
        ...task.toObject(),
        dueDate: formatDate(task.dueDate),
      },
      message: 'Task Updated',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const userId = req.auth._id;
    const { id } = req.params;
    const redis = await createRedisClient();

    const task = await Task.findOneAndDelete({ _id: id, userId });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await redis.del(`task:${userId}:${id}`);
    await clearUserCache(userId);

    return res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTaskStats = async (req, res) => {
  try {
    const userId = req.auth._id;

    const stats = await Task.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$completed',
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {
      completed: stats.find(s => s._id === true)?.count || 0,
      notCompleted: stats.find(s => s._id === false)?.count || 0
    };

    return res.status(200).json({ data: result });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const clearCache = async (req, res) => {
  try {
    const userId = req.auth._id;
    await clearUserCache(userId);
    res.json({ message: 'Cache cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
