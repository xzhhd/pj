import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { List, Modal, Button, InputNumber, Input, message, Select, Radio } from 'antd';
import { createClassEvaluation, queryClassIndicators } from '@/services/student';
import useSWR from 'swr';

// 简化：模拟几个班级
const classes = [
  { id: 101, name: '一(1)班' },
  { id: 102, name: '一(2)班' },
  { id: 201, name: '二(1)班' },
];

const ClassProcessGrading: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<any>();
  const [indicatorId, setIndicatorId] = useState<number | undefined>();
  const [op, setOp] = useState<'+' | '-'>('+');
  const [count, setCount] = useState<number>(1);
  const [comment, setComment] = useState<string>('');
  const { data: indData } = useSWR(['/api/classIndicators', { current:1, pageSize: 1000 }], ([, params])=> queryClassIndicators(params));

  const onSave = async () => {
    if (!current || !indicatorId) return message.warning('请选择指标');
    const indicator = (indData?.data || []).find((i:any)=> i.id === indicatorId);
    if (!indicator) return message.warning('指标无效');
    const base = Number(indicator.score) || 0; // 可能为负分
    const signed = op === '+' ? base : -base;
    const finalScore = signed * (Number(count) || 1);
    const date = new Date().toISOString().slice(0,10);
    await createClassEvaluation({
      classId: current.id,
      date,
      score: finalScore,
      comment,
      indicatorId: indicator.id,
      indicatorName: indicator.name,
    });
    message.success('已保存');
    setOpen(false);
    setIndicatorId(undefined);
    setOp('+');
    setCount(1);
    setComment('');
  };

  return (
    <PageContainer>
      <List
        dataSource={classes}
        renderItem={(item)=> (
          <List.Item actions={[<a key="grade" onClick={()=>{ setCurrent(item); setOpen(true); }}>点评</a>] }>
            <List.Item.Meta title={`${item.name}（ID: ${item.id}）`} description="点击点评对该班级进行一次评分/备注" />
          </List.Item>
        )}
      />

      <Modal title={`班级点评：${current?.name || ''}`} open={open} onCancel={()=> setOpen(false)} onOk={onSave} okText="保存">
        <div style={{ marginBottom: 12 }}>
          指标：
          <Select
            style={{ minWidth: 220 }}
            placeholder="请选择指标"
            value={indicatorId}
            onChange={(v)=> setIndicatorId(v)}
            options={(indData?.data||[]).map((i:any)=> ({ label: `${i.name}（${i.score}分）`, value: i.id }))}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          方向：<Radio.Group value={op} onChange={(e)=> setOp(e.target.value)}>
            <Radio.Button value="+">加分</Radio.Button>
            <Radio.Button value="-">扣分</Radio.Button>
          </Radio.Group>
          次数：<InputNumber min={1} value={count} onChange={(v)=> setCount(Number(v)||1)} style={{ marginLeft: 12 }} />
        </div>
        <div>
          备注：<Input.TextArea value={comment} onChange={(e)=> setComment(e.target.value)} rows={3} />
        </div>
      </Modal>
    </PageContainer>
  );
};

export default ClassProcessGrading;
