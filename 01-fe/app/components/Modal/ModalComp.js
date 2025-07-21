import React, { useEffect, useState } from 'react';
import { Button, Modal, Spin } from 'antd';


const ModalComponent = ({
    title = 'Default Title',
    triggerText = 'Open Modal',
    onOpen = () => {},
    onOk = () => {},
    onCancel = () => {},
    children,
    loading = false,
    closable = true,
    okText = 'OK',
    cancelText = 'Cancel',
    hidden = false,
    autoOpen = false,
    autoClose = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(()=>{
    if(autoOpen){
      console.log("opeennn--->")
        showModal()
    }
  },[autoOpen])

  useEffect(()=>{
      console.log("closee--->")

    if(autoClose){
      console.log("closee--->")

         setIsModalOpen(false);
    }
  },[autoClose])
  const showModal = async() => {
    await onOpen()
    setIsModalOpen(true);
  };
  const handleOk = async() => {
    await onOk()
    setIsModalOpen(false);
  };
  const handleCancel = async() => {
    await onCancel()
    setIsModalOpen(false);
  };
  return (
    <>
      <Button type="primary" onClick={showModal} className={'mr-5'}>
        {triggerText}
      </Button>
      <Modal
        title={title}
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={okText}
      >
       {loading ? <Spin /> : children}
      </Modal>
    </>
  );
};
export default ModalComponent;