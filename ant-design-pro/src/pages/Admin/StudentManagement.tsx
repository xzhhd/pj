import React, { useRef, useState } from 'react';
import { PageContainer, ProTable, ActionType, ProColumns, ModalForm, ProFormText } from '@ant-design/pro-components';
import { Button, Upload, message, Popconfirm } from 'antd';
import type { UploadProps } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { queryStudents, createStudent, updateStudent, deleteStudent, importStudents } from '@/services/student';

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

const StudentManagement: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [editing, setEditing] = useState<any>();

  const columns: ProColumns[] = [
    { title: 'ID', dataIndex: 'id', search: false },
    { title: '姓名', dataIndex: 'name' },
    { title: '学号', dataIndex: 'studentId' },
    { title: '班级', dataIndex: 'class' },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record: any) => [
        <a key="edit" onClick={()=> setEditing(record)}>编辑</a>,
        <Popconfirm key="del" title="确认删除？" onConfirm={async ()=>{ await deleteStudent(record.id); message.success('已删除'); actionRef.current?.reload(); }}>
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
      await importStudents(rows);
      message.success(`已导入 ${rows.length} 条`);
      actionRef.current?.reload();
      return false;
    },
  };

  return (
    <PageContainer>
      <ProTable
        rowKey="id"
        actionRef={actionRef}
        columns={columns}
        request={async (params)=>{
          const res = await queryStudents(params);
          return { data: res.data, success: true, total: res.total };
        }}
        toolBarRender={()=>[
          <ModalForm key="add" title="新增学生" trigger={<Button type="primary">新增学生</Button>} onFinish={async (v)=>{ await createStudent(v); message.success('已新增'); actionRef.current?.reload(); return true; }}>
            <ProFormText name="name" label="姓名" rules={[{ required: true }]} />
            <ProFormText name="studentId" label="学号" rules={[{ required: true }]} />
            <ProFormText name="class" label="班级" />
          </ModalForm>,
          <Upload key="imp" {...uploadProps}>
            <Button size="small" icon={<InboxOutlined />}>导入 CSV</Button>
          </Upload>,
          <Button key="exp" onClick={async ()=>{
            const params: any = (actionRef.current as any)?.getSearchParams?.() || {};
            const res = await queryStudents({ ...params, current: 1, pageSize: 10000 });
            const rows = res.data || [];
            const { toCSV, downloadCSV } = await import('@/utils/csv');
            const csv = toCSV(rows, ['id','name','studentId','class']);
            downloadCSV(csv, 'students.csv');
          }}>导出 CSV</Button>
        ]}
        pagination={{ pageSize: 10 }}
      />

      <ModalForm
        title="编辑学生"
        open={!!editing}
        initialValues={editing}
        onOpenChange={(o)=> !o && setEditing(undefined)}
        onFinish={async (v)=>{ await updateStudent(editing.id, v); message.success('已保存'); setEditing(undefined); actionRef.current?.reload(); return true; }}
      >
        <ProFormText name="name" label="姓名" rules={[{ required: true }]} />
        <ProFormText name="studentId" label="学号" rules={[{ required: true }]} />
        <ProFormText name="class" label="班级" />
      </ModalForm>
    </PageContainer>
  );
};

export default StudentManagement;
