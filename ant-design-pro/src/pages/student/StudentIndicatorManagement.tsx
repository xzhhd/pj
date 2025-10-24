import React, { useRef, useState } from 'react';
import { PageContainer, ProTable, ActionType, ProColumns, ModalForm, ProFormText, ProFormDigit } from '@ant-design/pro-components';
import { Button, Upload, message, Popconfirm } from 'antd';
import type { UploadProps } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

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

const StudentIndicatorManagement: React.FC = () => {
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
        <Popconfirm key="del" title="确认删除？" onConfirm={async ()=>{ await fetch(`/api/indicator/${record.id}`, { method: 'DELETE' }); message.success('已删除'); actionRef.current?.reload(); }}>
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
      await fetch('/api/indicator/import', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data: rows }) });
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
          const res = await fetch(`/api/indicators?${new URLSearchParams(params as any).toString()}`).then(r=>r.json());
          return { data: res.data, success: true, total: res.total };
        }}
        toolBarRender={()=>[
          <ModalForm key="add" title="新增指标" trigger={<Button type="primary">新增指标</Button>} onFinish={async (v)=>{ await fetch('/api/indicator', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(v)}); message.success('已新增'); actionRef.current?.reload(); return true; }}>
            <ProFormText name="name" label="指标名称" rules={[{ required: true }]} />
            <ProFormDigit name="score" label="分值" rules={[{ required: true }]} />
            <ProFormDigit name="weight" label="权重" initialValue={1} />
          </ModalForm>,
          <Upload key="imp" {...uploadProps}>
            <Button size="small" icon={<InboxOutlined />}>导入 CSV</Button>
          </Upload>,
          <Button key="exp" onClick={async ()=>{
            const res = await fetch('/api/indicators?current=1&pageSize=10000').then(r=>r.json());
            const rows = res.data || [];
            const { toCSV, downloadCSV } = await import('@/utils/csv');
            const csv = toCSV(rows, ['id','name','score','weight']);
            downloadCSV(csv, 'indicators.csv');
          }}>导出 CSV</Button>
        ]}
      />

      <ModalForm
        title="编辑指标"
        open={!!editing}
        initialValues={editing}
        onOpenChange={(o)=> !o && setEditing(undefined)}
        onFinish={async (v)=>{ await fetch(`/api/indicator/${editing.id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(v)}); message.success('已保存'); setEditing(undefined); actionRef.current?.reload(); return true; }}
      >
        <ProFormText name="name" label="指标名称" rules={[{ required: true }]} />
        <ProFormDigit name="score" label="分值" rules={[{ required: true }]} />
        <ProFormDigit name="weight" label="权重" />
      </ModalForm>
    </PageContainer>
  );
};

export default StudentIndicatorManagement;
