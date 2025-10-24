import React, { useRef, useState } from 'react';
import { PageContainer, ProTable, ActionType, ProColumns, ModalForm, ProFormText } from '@ant-design/pro-components';
import { Button, message, Popconfirm } from 'antd';
import { queryRoles, createRole, updateRole, deleteRole } from '@/services/student';

const RoleManagement: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [editing, setEditing] = useState<any>();

  const columns: ProColumns[] = [
    { title: 'ID', dataIndex: 'id', search: false },
    { title: '角色名', dataIndex: 'name' },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record: any) => [
        <a key="edit" onClick={()=> setEditing(record)}>编辑</a>,
        <Popconfirm key="del" title="确认删除？" onConfirm={async ()=>{ await deleteRole(record.id); message.success('已删除'); actionRef.current?.reload(); }}>
          <a style={{ color: '#ff4d4f' }}>删除</a>
        </Popconfirm>
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable
        rowKey="id"
        actionRef={actionRef}
        columns={columns}
        request={async ()=>{
          const res = await queryRoles();
          return { data: res.data || [], success: true, total: (res.data||[]).length };
        }}
        toolBarRender={()=>[
          <ModalForm key="add" title="新增角色" trigger={<Button type="primary">新增角色</Button>} onFinish={async (v)=>{ await createRole(v); message.success('已新增'); actionRef.current?.reload(); return true; }}>
            <ProFormText name="name" label="角色名" rules={[{ required: true }]} />
          </ModalForm>
        ]}
        pagination={false}
      />

      <ModalForm
        title="编辑角色"
        open={!!editing}
        initialValues={editing}
        onOpenChange={(o)=> !o && setEditing(undefined)}
        onFinish={async (v)=>{ await updateRole(editing.id, v); message.success('已保存'); setEditing(undefined); actionRef.current?.reload(); return true; }}
      >
        <ProFormText name="name" label="角色名" rules={[{ required: true }]} />
      </ModalForm>
    </PageContainer>
  );
};

export default RoleManagement;
