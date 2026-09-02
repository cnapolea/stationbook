import { API_BASE_URL } from '../../config';

export const ALERT_TYPES = {
  WARNING: 'warning',
  DANGER: 'danger',
  SUCCESS: 'success',
};

export const SCREEN_STATES = {
  IDLE: 'idle',
  ERROR: 'error',
  LOADING: 'loading',
  SUCCESS: 'success',
  LOADED: 'loaded',
};

export const HTTP_REQUEST_METHOD = {
  POST: 'POST',
  GET: 'GET',
  PATCH: 'PATCH',
};

export const CLIENT_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  WORKSTATIONS: '/workstations',
};

export const FORM_INPUT_TYPES = {
  TEXT: 'text',
  EMAIL: 'email',
  PASSWORD: 'password',
};

export const AUTH_TYPE = {
  LOGIN: 'login',
  REGISTER: 'register',
};

export const SERVER_API_ENDPOINTS = {
  login: `${API_BASE_URL}/auth/login`,
  register: `${API_BASE_URL}/auth/register`,
  workstations: `${API_BASE_URL}/api/workstations`,
  workstationSlots: (workstationdId) =>
    `${API_BASE_URL}/api/workstations/${workstationdId}/slots`,
};

export const RESPONSE_STATUS_CODE = {
  NOT_AUTHENTICATED: 401,
  SUCCESS: 200,
};
