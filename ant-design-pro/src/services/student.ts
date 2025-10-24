import request from '@/utils/request';

// Teachers
export async function queryTeachers(params?: any){
  return request('/api/teachers', { params });
}
export async function createTeacher(data: any){
  return request('/api/teacher', { method: 'POST', data });
}
export async function updateTeacher(id: number, data: any){
  return request(`/api/teacher/${id}`, { method: 'PUT', data });
}
export async function deleteTeacher(id: number){
  return request(`/api/teacher/${id}`, { method: 'DELETE' });
}
export async function importTeachers(rows: any[]){
  return request('/api/teacher/import', { method: 'POST', data: { data: rows } });
}

// Students
export async function queryStudents(params?: any){
  return request('/api/students', { params });
}
export async function createStudent(data: any){
  return request('/api/student', { method: 'POST', data });
}
export async function updateStudent(id: number, data: any){
  return request(`/api/student/${id}`, { method: 'PUT', data });
}
export async function deleteStudent(id: number){
  return request(`/api/student/${id}`, { method: 'DELETE' });
}
export async function importStudents(rows: any[]){
  return request('/api/student/import', { method: 'POST', data: { data: rows } });
}

// Evaluations
export async function queryEvaluations(params?: any){
  return request('/api/evaluations', { params });
}
export async function createEvaluation(data: any){
  return request('/api/evaluation', { method: 'POST', data });
}

// Class Evaluations
export async function queryClassEvaluations(params?: any){
  return request('/api/classEvaluations', { params });
}
export async function createClassEvaluation(data: any){
  return request('/api/classEvaluation', { method: 'POST', data });
}

// Roles
export async function queryRoles(){
  return request('/api/roles');
}
export async function createRole(data: any){
  return request('/api/role', { method: 'POST', data });
}
export async function updateRole(id: number, data: any){
  return request(`/api/role/${id}`, { method: 'PUT', data });
}
export async function deleteRole(id: number){
  return request(`/api/role/${id}`, { method: 'DELETE' });
}

// Indicators
export async function queryIndicators(params?: any){
  return request('/api/indicators', { params });
}
export async function createIndicator(data: any){
  return request('/api/indicator', { method: 'POST', data });
}
export async function updateIndicator(id: number, data: any){
  return request(`/api/indicator/${id}`, { method: 'PUT', data });
}
export async function deleteIndicator(id: number){
  return request(`/api/indicator/${id}`, { method: 'DELETE' });
}
export async function importIndicators(rows: any[]){
  return request('/api/indicator/import', { method: 'POST', data: { data: rows } });
}

// Class Indicators
export async function queryClassIndicators(params?: any){
  return request('/api/classIndicators', { params });
}
export async function createClassIndicator(data: any){
  return request('/api/classIndicator', { method: 'POST', data });
}
export async function updateClassIndicator(id: number, data: any){
  return request(`/api/classIndicator/${id}`, { method: 'PUT', data });
}
export async function deleteClassIndicator(id: number){
  return request(`/api/classIndicator/${id}`, { method: 'DELETE' });
}
export async function importClassIndicators(rows: any[]){
  return request('/api/classIndicator/import', { method: 'POST', data: { data: rows } });
}
