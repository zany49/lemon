import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { DatePicker, Select, Input, Button, message } from 'antd';
import dayjs from 'dayjs';
import { useState, useEffect, useRef } from 'react';
import axiosInstance from '@/app/components/axiosInstance/axiosInstance';
import ModalComponent from '@/app/components/Modal/ModalComp';


const { Option } = Select;

// Validation Schema
const TaskSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string(),
  status: Yup.boolean().required('Status is required'),
  dueDate: Yup.date().required('Due date is required'),
});

export default function TaskModal({ 
  isOpen, 
  onClose, 
  initialData = null,  
  refreshTasks,
  setInitialdata  
}) {
  const [loading, setLoading] = useState(false);
  const [autClose,setAutClose] = useState(false)
  const isEditing = Boolean(initialData);
  const [messageApi, contextHolder] = message.useMessage();
const formikRef = useRef();

const handleSubmit = async (values, { resetForm }) => {
  setLoading(true);
  try {
    const payload = {
      ...values,
      dueDate: values.dueDate ? values.dueDate.toISOString() : null,
      completed: values.status,
    };

    if (isEditing) {
      await axiosInstance.put(`/api/update-task/${initialData._id}`, payload);
      messageApi.open({
        type: 'success',
        content: 'Task updated successfully!',
      });
    } else {
      await axiosInstance.post('/api/create-task', payload);
      messageApi.open({
        type: 'success',
        content: 'Task created successfully!',
      });
    }
    resetForm();
    setInitialdata(null);
    refreshTasks?.();
    onClose();         

  } catch (error) {
    console.error(error);
    messageApi.open({
      type: 'error',
      content: 'Something went wrong!',
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <>
    {contextHolder}
    <ModalComponent
      title={isEditing ? 'Edit Task' : 'Create Task'}
      triggerText={'Create Task'}  
      autoOpen={isOpen}
      autoClose={isOpen}
      onCancel={()=>{
    if (formikRef.current) {
      formikRef.current.resetForm();  
    }
    setInitialdata(null);
        onClose()
    }}
      okText={isEditing ? 'Update' : 'Add'}
      cancelText="Cancel"
      onOk={() => document.getElementById('task-submit-btn').click()} 
    >
      <Formik
      innerRef={formikRef} 
        enableReinitialize
        initialValues={{
          title: initialData?.title || '',
          description: initialData?.description || '',
          status: initialData?.completed,
          dueDate: initialData?.dueDate ? dayjs(initialData.dueDate, 'DD-MM-YYYY') : null,
        }}
        validationSchema={TaskSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values }) => (
          <Form className="flex flex-col gap-4 p-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium">Title</label>
              <Field
                name="title"
                as={Input}
                placeholder="Enter task title"
                className="mt-1"
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-500 text-xs mt-1"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium">Description</label>
              <Field
                name="description"
                as={Input.TextArea}
                placeholder="Enter task description"
                className="mt-1"
              />
            </div>

            {/* Status Dropdown */}
            <div>
              <label className="block text-sm font-medium">Status</label>
              <Select
                value={values.status}
                onChange={(val) => setFieldValue('status', val)}
                placeholder="Select status"
                className="w-full mt-1"
              >
                <Option value={true}>Completed</Option>
                <Option value={false}>Not Completed</Option>
              </Select>
              <ErrorMessage
                name="status"
                component="div"
                className="text-red-500 text-xs mt-1"
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium">Due Date</label>
              <DatePicker
                className="w-full mt-1"
                value={values.dueDate}
                onChange={(date) => setFieldValue('dueDate', date)}
                format="DD-MM-YYYY"
              />
              <ErrorMessage
                name="dueDate"
                component="div"
                className="text-red-500 text-xs mt-1"
              />
            </div>

            {/* Hidden Submit Button */}
            <Button
              id="task-submit-btn"
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{display:"none"}}
            >
              {isEditing ? 'Update Task' : 'Add Task'}
            </Button>
          </Form>
        )}
      </Formik>
    </ModalComponent>
    </>

  );
}
