import React, { useRef, useState } from 'react';
import { PageContainer, ProTable, ActionType, ProColumns, ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { Button, Upload, message, Popconfirm } from 'antd';
import type { UploadProps } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { queryTeachers, createTeacher, updateTeacher, deleteTeacher, importTeachers } from '@/services/student';

const parseCSV = async (file: File): Promise<any[]> => {
  const text = await file.text();
  const lines = text.split(/\r?\n/).filter(Boolean);
  const headers = lines[0].split(',').map((s)=>s.trim());
  return lines.slice(1).map((l)=>{
    const cells = l.split(',');
    const obj: any = {};
    headers.forEach((h, i)=> obj[h] = (cells[i]||'').trim());
    return obj;
  });
};

const TeacherManagement: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [editing, setEditing] = useState<any>();

  const columns: ProColumns[] = [
    { title: 'ID', dataIndex: 'id', search: false },
    { title: '姓名', dataIndex: 'name' },
    { title: '工号', dataIndex: 'staffId' },
    { title: '邮箱', dataIndex: 'email' },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record: any) => [
        <a key="edit" onClick={()=> setEditing(record)}>编辑</a>,
        <Popconfirm key="del" title="确认删除？" onConfirm={async ()=>{ await deleteTeacher(record.id); message.success('已删除'); actionRef.current?.reload(); }}>
          <a style={{ color: '#ff4d4f' }}>删除</a>
        </Popconfirm>
      ],
    },
  ];

  const uploadProps: UploadProps = {
    accept: '.csv',
    showUploadList: false,
    beforeUpload: async (file) => {
      const rows = await parseCSV(file);
      if (!rows.length) { message.warning('CSV 内容为空'); return false; }
      await importTeachers(rows);
      message.success(`已导入 ${rows.length} 条`);
      actionRef.current?.reload();
      return false; // 阻止默认上传
    },
  };

  return (
    <PageContainer>
      <ProTable
        rowKey="id"
        actionRef={actionRef}
        columns={columns}
        request={async (params)=>{
          const res = await queryTeachers(params);
          return { data: res.data, success: true, total: res.total };
        }}
        toolBarRender={()=>[
          <ModalForm key="add" title="新增教师" trigger={<Button type="primary">新增教师</Button>} onFinish={async (v)=>{ await createTeacher(v); message.success('已新增'); actionRef.current?.reload(); return true; }}>
            <ProFormText name="name" label="姓名" rules={[{ required: true }]} />
            <ProFormText name="staffId" label="工号" rules={[{ required: true }]} />
            <ProFormText name="email" label="邮箱" />
            <ProFormTextArea name="remark" label="备注" />
          </ModalForm>,
          <Upload key="imp" {...uploadProps}>
            <Button size="small" icon={<InboxOutlined />}>导入 CSV</Button>
          </Upload>,
          <Button key="exp" onClick={async ()=>{
            const params: any = (actionRef.current as any)?.getSearchParams?.() || {};
            const res = await queryTeachers({ ...params, current: 1, pageSize: 10000 });
            const rows = res.data || [];
            const { toCSV, downloadCSV } = await import('@/utils/csv');
            const csv = toCSV(rows, ['id','name','staffId','email','remark']);
            downloadCSV(csv, 'teachers.csv');
          }}>导出 CSV</Button>
        ]}
        pagination={{ pageSize: 10 }}
      />

      <ModalForm
        title="编辑教师"
        open={!!editing}
        initialValues={editing}
        onOpenChange={(o)=> !o && setEditing(undefined)}
        onFinish={async (v)=>{ await updateTeacher(editing.id, v); message.success('已保存'); setEditing(undefined); actionRef.current?.reload(); return true; }}
      >
        <ProFormText name="name" label="姓名" rules={[{ required: true }]} />
        <ProFormText name="staffId" label="工号" rules={[{ required: true }]} />
        <ProFormText name="email" label="邮箱" />
        <ProFormTextArea name="remark" label="备注" />
      </ModalForm>
    </PageContainer>
  );
};

export default TeacherManagement;
