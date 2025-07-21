"use client"
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Input, Button, message,Card } from 'antd';
import axiosInstance from '../axiosInstance/axiosInstance';
import { useRouter } from 'next/navigation';

const AuthSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export default function AuthCard({title}) {
    const [messageApi, contextHolder] = message.useMessage();
    const router = useRouter()

  const handleAuth = async(values) => {
    try{
    console.log('vals:', values);
    let apiCall =  title === 'Login' ? '/api/login':'/api/register'
    const res = await axiosInstance.post(apiCall,values)
    if(res.status === 200){
      messageApi.open({
      type: 'success',
      content:  res.data.message,
    });
    if(title === 'Login'){
       sessionStorage.setItem("userData", JSON.stringify(res.data.user));
       router.push('/task/dashboard')
    }
    }
  }catch(e){
    console.log("errr--->",e)
      messageApi.open({
      type: 'error',
      content:  e.response.data.message,
    });
  }
  };

  const handleAuthRoute = ()=>{
    if(title === 'Login'){
       router.push('/register')
    }else{
       router.push('/login')
    }
  }

  return (
    <>
    {contextHolder}
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card
        title={title}
        className="w-full max-w-md shadow-xl rounded-2xl"
        style={{ textAlign: 'center', fontSize: '1.5rem' }}
      >
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={AuthSchema}
        onSubmit={handleAuth}
      >
        {({ handleSubmit }) => (
          <Form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Field name="email">
                {({ field }) => (
                  <Input {...field} placeholder="Email" size="large" />
                )}
              </Field>
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <Field name="password">
                {({ field }) => (
                  <Input.Password {...field} placeholder="Password" size="large" />
                )}
              </Field>
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-blue-500 hover:bg-blue-600"
              size="large"
            >
            { title === 'Login' ? 'Login': 'Register'}
            </Button>
            <p className="text-sm font-medium text-gray-600">
              {title === 'Register' ? 'Already an user?' : 'Not an user?'}
            </p>
            <Button
              type="primary"
              variant="outlined"
              className="w-full bg-blue-500 hover:bg-blue-600"
              size="large"
              onClick={handleAuthRoute}
            >
            { title === 'Register' ? 'Login': 'Register'}
            </Button>
          </Form>
        )}
      </Formik>
      </Card>
    </div>
    </>

  );
}
