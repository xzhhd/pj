import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { List, Button, Modal, Input, message, Select, Radio, InputNumber } from 'antd';
import useSWR from 'swr';
import { createEvaluation, queryStudents, queryIndicators } from '@/services/student';

const StudentProcessGrading: React.FC = () => {
  const { data } = useSWR(['/api/students', { current:1, pageSize: 1000 }], ([, params])=> queryStudents(params));
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<any>(null);
  const [indicatorId, setIndicatorId] = useState<number | undefined>();
  const [op, setOp] = useState<'+' | '-'>('+');
  const [count, setCount] = useState<number>(1);
  const [comment, setComment] = useState('');
  const { data: indData } = useSWR(['/api/indicators', { current:1, pageSize: 1000 }], ([, params])=> queryIndicators(params));

  const open = (item:any)=>{ setCurrent(item); setVisible(true); setIndicatorId(undefined); setOp('+'); setCount(1); setComment(''); }
  const submit = async ()=>{
    if (!current || !indicatorId) { message.warning('请选择指标'); return; }
    const indicator = (indData?.data || []).find((i:any)=> i.id === indicatorId);
    if (!indicator) { message.warning('指标无效'); return; }
    const base = Number(indicator.score) || 0;
    const signed = op === '+' ? base : -base;
    const finalScore = signed * (Number(count) || 1);
    await createEvaluation({
      studentId: current.id,
      date: new Date().toISOString().slice(0,10),
      score: finalScore,
      comment,
      indicatorId: indicator.id,
      indicatorName: indicator.name,
    });
    message.success('已保存');
    setVisible(false);
  }

  return (
    <PageContainer>
      <List
        bordered
        dataSource={data?.data || []}
        renderItem={item=> (
          <List.Item actions={[<Button type="primary" onClick={()=>open(item)}>打分</Button>] }>
            {item.name}
          </List.Item>
        )}
      />

      <Modal title={`给 ${current?.name || ''} 点评`} open={visible} onOk={submit} onCancel={()=>setVisible(false)}>
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
        <Input.TextArea rows={3} value={comment} onChange={e=>setComment(e.target.value)} placeholder="备注（可选）" />
      </Modal>
    </PageContainer>
  );
};

export default StudentProcessGrading;
