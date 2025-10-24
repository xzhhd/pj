import type { Request, Response } from 'express';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

async function getFakeCaptcha(_req: Request, res: Response) {
  await waitTime(2000);
  return res.json('captcha-xxx');
}

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;

/**
 * 当前用户的权限，如果为空代表没登录
 * current user access， if is '', user need login
 * 如果是 pro 的预览，默认是有权限的
 */
let access =
  ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site' ? 'admin' : '';

const getAccess = () => {
  return access;
};

// 代码中会兼容本地 service mock 以及部署站点的静态数据
// In-memory datasets for demo/mock (moved outside default export)
let teachers: any[] = [
  { id: 1, name: '王老师', staffId: 'T1001', email: 't1@example.com' },
];
let students: any[] = [
  { id: 1, name: '张三', studentId: 'S1001', class: '一班' },
  { id: 2, name: '李四', studentId: 'S1002', class: '一班' },
];
let roles: any[] = [
  { id: 1, name: 'admin' },
  { id: 2, name: 'teacher' },
];
let evaluations: any[] = [
  { id: 1, studentId: 1, date: '2025-09-01', score: 4, comment: '表现良好', indicatorId: 1, indicatorName: '课堂发言' },
];
let indicators: any[] = [
  { id: 1, name: '课堂发言', score: 2, weight: 1 },
  { id: 2, name: '作业上交', score: 3, weight: 1 },
];
let classIndicators: any[] = [
  { id: 1, name: '上课睡觉', score: -2, weight: 1 },
  { id: 2, name: '乱扔垃圾', score: -1, weight: 1 },
];
let classEvaluations: any[] = [
  { id: 1, classId: 101, date: '2025-09-01', score: 5, comment: '班级表现良好', indicatorId: 1, indicatorName: '上课睡觉' },
];

// utils
const paginate = (arr: any[], current: number, pageSize: number) => {
  const start = (current - 1) * pageSize;
  return arr.slice(start, start + pageSize);
};

export default {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': (_req: Request, res: Response) => {
    if (!getAccess()) {
      res.status(401).send({
        data: {
          isLogin: false,
        },
        errorCode: '401',
        errorMessage: '请先登录！',
        success: true,
      });
      return;
    }
    res.send({
      success: true,
      data: {
        name: 'Serati Ma',
        avatar:
          'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        userid: '00000001',
        email: 'antdesign@alipay.com',
        signature: '海纳百川，有容乃大',
        title: '交互专家',
        group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
        tags: [
          {
            key: '0',
            label: '很有想法的',
          },
          {
            key: '1',
            label: '专注设计',
          },
          {
            key: '2',
            label: '辣~',
          },
          {
            key: '3',
            label: '大长腿',
          },
          {
            key: '4',
            label: '川妹子',
          },
          {
            key: '5',
            label: '海纳百川',
          },
        ],
        notifyCount: 12,
        unreadCount: 11,
        country: 'China',
        access: getAccess(),
        geographic: {
          province: {
            label: '浙江省',
            key: '330000',
          },
          city: {
            label: '杭州市',
            key: '330100',
          },
        },
        address: '西湖区工专路 77 号',
        phone: '0752-268888888',
      },
    });
  },
  // GET POST 可省略
  'GET /api/users': [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ],
  'POST /api/login/account': async (req: Request, res: Response) => {
    const { password, username, type } = req.body;
    await waitTime(2000);
    if (password === 'ant.design' && username === 'admin') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin',
      });
      access = 'admin';
      return;
    }
    if (password === 'ant.design' && username === 'user') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'user',
      });
      access = 'user';
      return;
    }
    if (type === 'mobile') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin',
      });
      access = 'admin';
      return;
    }

    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest',
    });
    access = 'guest';
  },
  'POST /api/login/outLogin': (_req: Request, res: Response) => {
    access = '';
    res.send({ data: {}, success: true });
  },
  'POST /api/register': (_req: Request, res: Response) => {
    res.send({ status: 'ok', currentAuthority: 'user', success: true });
  },
  'GET /api/500': (_req: Request, res: Response) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (_req: Request, res: Response) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (_req: Request, res: Response) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Forbidden',
      message: 'Forbidden',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (_req: Request, res: Response) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },

  // Teachers CRUD + list + import
  'GET /api/teachers': (req: Request, res: Response) => {
    const { current = 1, pageSize = 10, name } = (req.query || {}) as any;
    let list = teachers;
    if (name) list = list.filter((t) => String(t.name).includes(String(name)));
    const total = list.length;
    const data = paginate(list, Number(current), Number(pageSize));
    res.send({ data, total, success: true, current: Number(current), pageSize: Number(pageSize) });
  },
  'POST /api/teacher': (req: Request, res: Response) => {
    const payload = req.body || {};
    const id = teachers.length ? Math.max(...teachers.map((i) => i.id)) + 1 : 1;
    const item = { id, ...payload };
    teachers.push(item);
    res.send({ success: true, data: item });
  },
  'PUT /api/teacher/:id': (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const idx = teachers.findIndex((i) => i.id === id);
    if (idx === -1) return res.status(404).send({ success: false });
    teachers[idx] = { ...teachers[idx], ...(req.body || {}) };
    res.send({ success: true, data: teachers[idx] });
  },
  'DELETE /api/teacher/:id': (req: Request, res: Response) => {
    const id = Number(req.params.id);
    teachers = teachers.filter((i) => i.id !== id);
    res.send({ success: true });
  },
  'POST /api/teacher/remove': (req: Request, res: Response) => {
    const id = Number((req.body || {}).id);
    teachers = teachers.filter((i) => i.id !== id);
    res.send({ success: true });
  },
  'POST /api/teacher/import': (req: Request, res: Response) => {
    const rows = (req.body && (req.body as any).data) || [];
    rows.forEach((r: any) => {
      const id = teachers.length ? Math.max(...teachers.map((i) => i.id)) + 1 : 1;
      teachers.push({ id, ...r });
    });
    res.send({ success: true, count: rows.length });
  },

  // Students CRUD + list + import
  'GET /api/students': (req: Request, res: Response) => {
    const { current = 1, pageSize = 10, name, studentId, class: className } = (req.query || {}) as any;
    let list = students;
    if (name) list = list.filter((t) => String(t.name).includes(String(name)));
    if (studentId) list = list.filter((t) => String(t.studentId).includes(String(studentId)));
    if (className) list = list.filter((t) => String(t.class).includes(String(className)));
    const total = list.length;
    const data = paginate(list, Number(current), Number(pageSize));
    res.send({ data, total, success: true, current: Number(current), pageSize: Number(pageSize) });
  },
  'POST /api/student': (req: Request, res: Response) => {
    const payload = req.body || {};
    const id = students.length ? Math.max(...students.map((i) => i.id)) + 1 : 1;
    const item = { id, ...payload };
    students.push(item);
    res.send({ success: true, data: item });
  },
  'PUT /api/student/:id': (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const idx = students.findIndex((i) => i.id === id);
    if (idx === -1) return res.status(404).send({ success: false });
    students[idx] = { ...students[idx], ...(req.body || {}) };
    res.send({ success: true, data: students[idx] });
  },
  'DELETE /api/student/:id': (req: Request, res: Response) => {
    const id = Number(req.params.id);
    students = students.filter((i) => i.id !== id);
    res.send({ success: true });
  },
  'POST /api/student/remove': (req: Request, res: Response) => {
    const id = Number((req.body || {}).id);
    students = students.filter((i) => i.id !== id);
    res.send({ success: true });
  },
  'POST /api/student/import': (req: Request, res: Response) => {
    const rows = (req.body && (req.body as any).data) || [];
    rows.forEach((r: any) => {
      const id = students.length ? Math.max(...students.map((i) => i.id)) + 1 : 1;
      students.push({ id, ...r });
    });
    res.send({ success: true, count: rows.length });
  },

  // Roles
  'GET /api/roles': (req: Request, res: Response) => {
    res.send({ success: true, data: roles });
  },
  'POST /api/role': (req: Request, res: Response) => {
    const id = roles.length ? Math.max(...roles.map((i) => i.id)) + 1 : 1;
    const item = { id, ...(req.body || {}) };
    roles.push(item);
    res.send({ success: true, data: item });
  },
  'PUT /api/role/:id': (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const idx = roles.findIndex((i) => i.id === id);
    if (idx === -1) return res.status(404).send({ success: false });
    roles[idx] = { ...roles[idx], ...(req.body || {}) };
    res.send({ success: true, data: roles[idx] });
  },
  'DELETE /api/role/:id': (req: Request, res: Response) => {
    const id = Number(req.params.id);
    roles = roles.filter((i) => i.id !== id);
    res.send({ success: true });
  },

  // Evaluations
  'GET /api/evaluations': (req: Request, res: Response) => {
    const { current = 1, pageSize = 10, studentId, start, end } = (req.query || {}) as any;
    let list = evaluations;
    if (studentId) list = list.filter((e) => String(e.studentId) === String(studentId));
    if (start) list = list.filter((e) => String(e.date) >= String(start));
    if (end) list = list.filter((e) => String(e.date) <= String(end));
    const total = list.length;
    const data = paginate(list, Number(current), Number(pageSize));
    res.send({ data, total, success: true, current: Number(current), pageSize: Number(pageSize) });
  },
  'POST /api/evaluation': (req: Request, res: Response) => {
    const id = evaluations.length ? Math.max(...evaluations.map((i) => i.id)) + 1 : 1;
    const item = { id, ...(req.body || {}) };
    evaluations.push(item);
    res.send({ success: true, data: item });
  },

  // Class Evaluations
  'GET /api/classEvaluations': (req: Request, res: Response) => {
    const { current = 1, pageSize = 10, classId, start, end } = (req.query || {}) as any;
    let list = classEvaluations;
    if (classId) list = list.filter((e) => String(e.classId) === String(classId));
    if (start) list = list.filter((e) => String(e.date) >= String(start));
    if (end) list = list.filter((e) => String(e.date) <= String(end));
    const total = list.length;
    const data = paginate(list, Number(current), Number(pageSize));
    res.send({ data, total, success: true, current: Number(current), pageSize: Number(pageSize) });
  },
  'POST /api/classEvaluation': (req: Request, res: Response) => {
    const id = classEvaluations.length ? Math.max(...classEvaluations.map((i) => i.id)) + 1 : 1;
    const item = { id, ...(req.body || {}) };
    classEvaluations.push(item);
    res.send({ success: true, data: item });
  },

  // Indicators (student behavior indicators)
  'GET /api/indicators': (req: Request, res: Response) => {
    const { current = 1, pageSize = 10, name } = (req.query || {}) as any;
    let list = indicators;
    if (name) list = list.filter((t) => String(t.name).includes(String(name)));
    const total = list.length;
    const data = paginate(list, Number(current), Number(pageSize));
    res.send({ data, total, success: true, current: Number(current), pageSize: Number(pageSize) });
  },
  'POST /api/indicator': (req: Request, res: Response) => {
    const id = indicators.length ? Math.max(...indicators.map((i) => i.id)) + 1 : 1;
    const item = { id, ...(req.body || {}) };
    indicators.push(item);
    res.send({ success: true, data: item });
  },
  'PUT /api/indicator/:id': (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const idx = indicators.findIndex((i) => i.id === id);
    if (idx === -1) return res.status(404).send({ success: false });
    indicators[idx] = { ...indicators[idx], ...(req.body || {}) };
    res.send({ success: true, data: indicators[idx] });
  },
  'DELETE /api/indicator/:id': (req: Request, res: Response) => {
    const id = Number(req.params.id);
    indicators = indicators.filter((i) => i.id !== id);
    res.send({ success: true });
  },
  'POST /api/indicator/import': (req: Request, res: Response) => {
    const rows = (req.body && (req.body as any).data) || [];
    rows.forEach((r: any) => {
      const id = indicators.length ? Math.max(...indicators.map((i) => i.id)) + 1 : 1;
      indicators.push({ id, ...r });
    });
    res.send({ success: true, count: rows.length });
  },

  // Class Indicators
  'GET /api/classIndicators': (req: Request, res: Response) => {
    const { current = 1, pageSize = 10, name } = (req.query || {}) as any;
    let list = classIndicators;
    if (name) list = list.filter((t) => String(t.name).includes(String(name)));
    const total = list.length;
    const data = paginate(list, Number(current), Number(pageSize));
    res.send({ data, total, success: true, current: Number(current), pageSize: Number(pageSize) });
  },
  'POST /api/classIndicator': (req: Request, res: Response) => {
    const id = classIndicators.length ? Math.max(...classIndicators.map((i) => i.id)) + 1 : 1;
    const item = { id, ...(req.body || {}) };
    classIndicators.push(item);
    res.send({ success: true, data: item });
  },
  'PUT /api/classIndicator/:id': (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const idx = classIndicators.findIndex((i) => i.id === id);
    if (idx === -1) return res.status(404).send({ success: false });
    classIndicators[idx] = { ...classIndicators[idx], ...(req.body || {}) };
    res.send({ success: true, data: classIndicators[idx] });
  },
  'DELETE /api/classIndicator/:id': (req: Request, res: Response) => {
    const id = Number(req.params.id);
    classIndicators = classIndicators.filter((i) => i.id !== id);
    res.send({ success: true });
  },
  'POST /api/classIndicator/import': (req: Request, res: Response) => {
    const rows = (req.body && (req.body as any).data) || [];
    rows.forEach((r: any) => {
      const id = classIndicators.length ? Math.max(...classIndicators.map((i) => i.id)) + 1 : 1;
      classIndicators.push({ id, ...r });
    });
    res.send({ success: true, count: rows.length });
  },

  'GET  /api/login/captcha': getFakeCaptcha,
};
