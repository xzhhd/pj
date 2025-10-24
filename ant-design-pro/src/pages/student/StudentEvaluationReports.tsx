import React, { useMemo, useRef } from 'react';
import { PageContainer, ProTable, ActionType, ProColumns, ProFormDateRangePicker, ProFormDigit } from '@ant-design/pro-components';
import { Card, Row, Col, Statistic, Button } from 'antd';
import { queryEvaluations } from '@/services/student';

const StudentEvaluationReports: React.FC = () => {
  const actionRef = useRef<ActionType>();

  type RowType = { id: number; studentId: number; date: string; score: number; comment?: string };

  const columns: ProColumns<RowType>[] = [
    { title: '学生ID', dataIndex: 'studentId' },
    { title: '日期', dataIndex: 'date', valueType: 'date' },
    { title: '分数', dataIndex: 'score', sorter: true },
    { title: '评语', dataIndex: 'comment', search: false },
  ];

  return (
    <PageContainer>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card><Statistic title="总评价数" valueRender={() => <span id="stat-total">--</span>} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="总分" valueRender={() => <span id="stat-sum">--</span>} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="平均分" valueRender={() => <span id="stat-avg">--</span>} /></Card>
        </Col>
      </Row>

      <ProTable<RowType>
        rowKey="id"
        actionRef={actionRef}
        columns={columns}
        request={async (params, sorter) => {
          const { current, pageSize, studentId, date } = params as any;
          const [start, end] = Array.isArray(date) ? date : [];
          const res = await queryEvaluations({ current, pageSize, studentId, start, end, sorter });
          // 计算统计
          const rows: RowType[] = res.data || [];
          const total = rows.length;
          const sum = rows.reduce((a, b) => a + (Number(b.score) || 0), 0);
          const avg = total ? (sum / total).toFixed(2) : '0.00';
          // 更新统计展示
          const setText = (id: string, v: string | number) => {
            const el = document.getElementById(id);
            if (el) el.textContent = String(v);
          };
          setText('stat-total', total);
          setText('stat-sum', sum);
          setText('stat-avg', avg);
          return { data: rows, success: true, total: res.total };
        }}
        toolBarRender={() => [
          <Button key="exp" onClick={async ()=>{
            const params: any = (actionRef.current as any)?.getSearchParams?.() || {};
            const { date, studentId } = params;
            const [start, end] = Array.isArray(date) ? date : [];
            const res = await queryEvaluations({ current: 1, pageSize: 10000, studentId, start, end });
            const rows: RowType[] = res.data || [];
            const { toCSV, downloadCSV } = await import('@/utils/csv');
            const csv = toCSV(rows, ['id','studentId','date','score','comment']);
            downloadCSV(csv, 'student-evaluation-report.csv');
          }}>导出 CSV</Button>
        ]}
        search={{
          labelWidth: 'auto',
          collapsed: false,
          span: 8,
        }}
        form={{
          syncToUrl: true,
          syncToInitialValues: true,
          transform: (values) => values,
        }}
      />
    </PageContainer>
  );
};

export default StudentEvaluationReports;
