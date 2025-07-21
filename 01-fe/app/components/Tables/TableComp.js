"use client"
import { Checkbox, Table } from 'antd';
import { use, useEffect, useState } from 'react';




const TableComp = ({
  dataSource,
  columns,
  passSelected,
  rowSelctionReq,
}) => {

   const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const onSelectChange = async (newSelectedRowKeys, selectedRows) => {
    console.log('selectedRowKeys changed:', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
    passSelected(newSelectedRowKeys)
  };

    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
       hideSelectAll: true,
    };

    const clearSelection = () => {
        setSelectedRowKeys([]);
      };

  return (
    <Table
    //   className={styles.customTable}
      rowSelection={null}
      pagination={false}
      columns={columns}
      dataSource={dataSource}
      scroll={{ x: 'max-content' , y: 400 }}
    />
  );
};

export default TableComp

