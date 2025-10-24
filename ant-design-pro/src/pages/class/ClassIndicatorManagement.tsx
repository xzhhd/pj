import React, { useRef, useState } from 'react';
import { PageContainer, ProTable, ActionType, ProColumns, ModalForm, ProFormText, ProFormDigit } from '@ant-design/pro-components';
import { Button, Upload, message, Popconfirm } from 'antd';
import type { UploadProps } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { queryClassIndicators, createClassIndicator, updateClassIndicator, deleteClassIndicator, importClassIndicators } from '@/services/student';

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

const ClassIndicatorManagement: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [editing, setEditing] = useState<any>();

  const columns: ProColumns[] = [
    { title: 'ID', dataIndex: 'id', search: false },
    { title: '指标名称', dataIndex: 'name' },
    { title: '分值', dataIndex: 'score' },
    { title: '权重', dataIndex: 'weight' },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record: any) => [
        <a key="edit" onClick={()=> setEditing(record)}>编辑</a>,
        <Popconfirm key="del" title="确认删除？" onConfirm={async ()=>{ await deleteClassIndicator(record.id); message.success('已删除'); actionRef.current?.reload(); }}>
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
      await importClassIndicators(rows);
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
          const res = await queryClassIndicators(params);
          return { data: res.data, success: true, total: res.total };
        }}
        toolBarRender={()=>[
          <ModalForm key="add" title="新增指标" trigger={<Button type="primary">新增指标</Button>} onFinish={async (v)=>{ await createClassIndicator(v); message.success('已新增'); actionRef.current?.reload(); return true; }}>
            <ProFormText name="name" label="指标名称" rules={[{ required: true }]} />
            <ProFormDigit name="score" label="分值" rules={[{ required: true }]} />
            <ProFormDigit name="weight" label="权重" initialValue={1} />
          </ModalForm>,
          <Upload key="imp" {...uploadProps}>
            <Button size="small" icon={<InboxOutlined />}>导入 CSV</Button>
          </Upload>,
          <Button key="exp" onClick={async ()=>{
            const res = await queryClassIndicators({ current: 1, pageSize: 10000 });
            const rows = res.data || [];
            const { toCSV, downloadCSV } = await import('@/utils/csv');
            const csv = toCSV(rows, ['id','name','score','weight']);
            downloadCSV(csv, 'class-indicators.csv');
          }}>导出 CSV</Button>
        ]}
      />

      <ModalForm
        title="编辑指标"
        open={!!editing}
        initialValues={editing}
        onOpenChange={(o)=> !o && setEditing(undefined)}
        onFinish={async (v)=>{ await updateClassIndicator(editing.id, v); message.success('已保存'); setEditing(undefined); actionRef.current?.reload(); return true; }}
      >
        <ProFormText name="name" label="指标名称" rules={[{ required: true }]} />
        <ProFormDigit name="score" label="分值" rules={[{ required: true }]} />
        <ProFormDigit name="weight" label="权重" />
      </ModalForm>
    </PageContainer>
  );
};

export default ClassIndicatorManagement;
