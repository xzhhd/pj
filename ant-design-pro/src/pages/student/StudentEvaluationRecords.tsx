import React, { useRef } from 'react';
import { PageContainer, ProTable, ActionType, ProColumns, ProFormDateRangePicker, ModalForm, ProFormTextArea, ProFormDigit, ProFormText } from '@ant-design/pro-components';
import { queryEvaluations, createEvaluation } from '@/services/student';

const StudentEvaluationRecords: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns[] = [
    { title: 'ID', dataIndex: 'id', search: false },
    { title: '学生ID', dataIndex: 'studentId' },
    { title: '日期', dataIndex: 'date', valueType: 'date' },
    { title: '指标', dataIndex: 'indicatorName', search: false },
    { title: '分数', dataIndex: 'score' },
    { title: '评语', dataIndex: 'comment', search: false },
  ];

  return (
    <PageContainer>
      <ProTable
        rowKey="id"
        actionRef={actionRef}
        columns={columns}
        request={async (params)=>{
          const { current, pageSize, studentId, date } = params as any;
          const [start, end] = Array.isArray(date) ? date : [];
          const res = await queryEvaluations({ current, pageSize, studentId, start, end });
          return { data: res.data, success: true, total: res.total };
        }}
        toolBarRender={()=>[
          <ModalForm key="add" title="新增评价" trigger={<a>新增评价</a>} onFinish={async (v)=>{ await createEvaluation(v); actionRef.current?.reload(); return true; }}>
            <ProFormDigit name="studentId" label="学生ID" rules={[{ required: true }]} />
            <ProFormText name="date" label="日期(YYYY-MM-DD)" rules={[{ required: true }]} />
            <ProFormDigit name="score" label="分数" rules={[{ required: true }]} />
            <ProFormTextArea name="comment" label="评语" />
          </ModalForm>,
          <a key="exp" onClick={async ()=>{
            // 粗略导出：抓取较大 pageSize 下的全部数据
            const res = await queryEvaluations({ current: 1, pageSize: 10000 });
            const rows = res.data || [];
            const { toCSV, downloadCSV } = await import('@/utils/csv');
            const csv = toCSV(rows, ['id','studentId','date','indicatorName','score','comment']);
            downloadCSV(csv, 'evaluations.csv');
          }}>导出 CSV</a>
        ]}
        search={{
          labelWidth: 'auto',
          optionRender: ({ searchText, resetText }, { form }) => [searchText, resetText],
          collapsed: false,
          span: 8,
        }}
      />
    </PageContainer>
  );
};

export default StudentEvaluationRecords;
