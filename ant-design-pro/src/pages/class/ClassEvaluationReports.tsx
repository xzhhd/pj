import React, { useRef } from 'react';
import { PageContainer, ProTable, ActionType, ProColumns } from '@ant-design/pro-components';
import { Card, Row, Col, Statistic, Button } from 'antd';
import { queryClassEvaluations } from '@/services/student';

interface RowType {
  id: number;
  classId: number;
  date: string;
  score: number;
  comment?: string;
}

const ClassEvaluationReports: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<RowType>[] = [
    { title: '班级ID', dataIndex: 'classId' },
    { title: '日期', dataIndex: 'date', valueType: 'date' },
    { title: '分数', dataIndex: 'score', sorter: true },
    { title: '备注', dataIndex: 'comment', search: false },
  ];

  return (
    <PageContainer>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}><Card><Statistic title="总评价数" value={0} /></Card></Col>
        <Col span={6}><Card><Statistic title="总分" value={0} /></Card></Col>
        <Col span={6}><Card><Statistic title="平均分" value={0} /></Card></Col>
      </Row>

      <ProTable<RowType>
        rowKey="id"
        actionRef={actionRef}
        columns={columns}
        request={async () => {
          // 骨架占位：暂不接后端，返回空数据
          return { data: [], success: true, total: 0 };
        }}
        toolBarRender={() => []}
        search={{ labelWidth: 'auto', collapsed: false, span: 8 }}
      />
    </PageContainer>
  );
};

export default ClassEvaluationReports;
