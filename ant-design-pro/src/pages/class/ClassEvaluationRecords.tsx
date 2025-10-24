import React, { useRef } from 'react';
import { PageContainer, ProTable, ActionType, ProColumns, ModalForm, ProFormDigit, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { Button } from 'antd';
import { queryClassEvaluations, createClassEvaluation } from '@/services/student';

interface RowType {
  id: number;
  classId: number;
  date: string;
  indicatorName?: string;
  score: number;
  comment?: string;
}

const ClassEvaluationRecords: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<RowType>[] = [
    { title: 'ID', dataIndex: 'id', search: false },
    { title: '班级ID', dataIndex: 'classId' },
    { title: '日期', dataIndex: 'date', valueType: 'date' },
    { title: '指标', dataIndex: 'indicatorName', search: false },
    { title: '分数', dataIndex: 'score' },
    { title: '备注', dataIndex: 'comment', search: false },
  ];

  return (
    <PageContainer>
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

export default ClassEvaluationRecords;
